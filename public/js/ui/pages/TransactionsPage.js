/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) console.error('Переданный элемент не существует!');
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener('click', (e) => {
        e.preventDefault();
        this.removeAccount();
    });
    this.element.querySelector('.content').addEventListener('click', (e) => {
      e.preventDefault();
        if (e.target.classList.contains('transaction__remove') ||
            e.target.classList.contains('fa-trash')) {
            let removeId = this.element.querySelector('.transaction__remove').dataset;
            this.removeTransaction(removeId);
        }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (typeof this.lastOptions === 'undefined') return;
    if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove({id: this.lastOptions.account_id}, (err, response) => {
          if (response && response.success) {
            App.updateWidgets();
            App.updateForms();
            this.clear();
          } else console.error('Ответ сервера отрицательный!');
        });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, (err, response) => {
          if (response && response.success) {
            App.update();
          } else console.error('Ответ сервера отрицательный!');
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) return;
    this.clear();
    this.lastOptions = options;
    
    Account.get(options.account_id, (err, response) => {
        if (response && response.success) {
          this.renderTitle(response.data.name);
        } else console.error('Ответ сервера отрицательный!');
    });
    
    Transaction.list(options, (err, response) => {
      if (response && response.success) {
          this.renderTransactions(response.data);
      } else console.error('Ответ сервера отрицательный!');
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    let container = this.element.querySelector('.content');
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    this.renderTitle('Название счёта');
    this.lastOptions = {};
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').textContent = `${name}`;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let newDate = new Date(date);
    return `${newDate.toLocaleString('default', {day:'numeric', month:'long', year:'numeric'})} в ${newDate.toLocaleTimeString().slice(0, -3)}`;
  }
  
  /**
   * Группирует цифры по разрядам 
   */
  numberWithSpace(sum) {
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * 
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                    <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                    <h4 class="transaction__title">${this.numberWithSpace(item.sum)}</h4>
                    <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                </div>
                </div>
                <div class="col-md-3">
                  <div class="transaction__summ">${this.numberWithSpace(item.sum)}<span class="currency"> ₽</span>
                  </div>
                </div>
                <div class="col-md-2 transaction__controls">
                    <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                        <i class="fa fa-trash"></i>  
                    </button>
                </div>
              </div>`;
    }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    for (let i = data.length - 1; i >= 0; i--) {
       this.element.querySelector('.content').insertAdjacentHTML('beforeend', this.getTransactionHTML(data[i]));
    }
  }
}