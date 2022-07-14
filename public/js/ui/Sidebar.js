/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    document.querySelector('.sidebar-toggle').addEventListener('click', (e) => {
        e.preventDefault();
        if (!document.body.classList.contains('sidebar-open')) {
          document.body.classList.remove('sidebar-collapse');
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
            document.body.classList.add('sidebar-collapse');
        }
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    document.querySelector('.menu-item_register > a').addEventListener('click', (e) => {
        e.preventDefault();
        App.getModal('register').open();
      });
    document.querySelector('.menu-item_login > a').addEventListener('click', (e) => {
        e.preventDefault();
        App.getModal('login').open();
      });
    document.querySelector('.menu-item_logout > a').addEventListener('click', (e) => {
        e.preventDefault();
        User.logout((err, response) => {
          if (response && response.success) App.setState('init');
        });
      });
  }
}