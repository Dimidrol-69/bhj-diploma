/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() { 
    Account.list(null, (err, response) => {
      if (response && response.success) {
          this.clear();
          response.data.forEach(item => {
          this.element[3].insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.name}</option>`);
        }); 
      } else console.error('Ответ сервера отрицательный!');
    });
  }

  /**
   * Очищает выпадающий список счетов
   */
  clear() {
    while (this.element[3].children.length !== 0) {
      this.element[3].children[0].remove();
    };
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.update();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
      } else console.error('Ответ сервера отрицательный!');
    });
  }
}