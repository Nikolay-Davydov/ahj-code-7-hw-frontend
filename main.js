/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Request.js
function runRequest(options = {}) {
  return new Promise((resolve, reject) => {
    const {
      headers,
      data,
      responseType,
      method
    } = options;
    const url = "http://localhost:7070/";
    const params = new URLSearchParams();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        params.append(key, data[key]);
      }
    }
    const xhr = new XMLHttpRequest();
    if (method === "GET") {
      xhr.open("GET", `${url}?${params}`);
    } else {
      xhr.open("POST", `${url}?${params}`);
    }
    for (const header in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, header)) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }
    xhr.responseType = responseType;
    if (method === "GET") {
      xhr.send();
    } else {
      xhr.send(params);
    }
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 500) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Ошибка ${xhr.status}\n${xhr.statusText}`));
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/js/EditForm.js
/* eslint-disable no-alert */

class EditForm {
  constructor(parentWidget) {
    this.parentWidget = parentWidget;
    this.ticket = {};
  }
  static get ctrlId() {
    return {
      form: "edit-form",
      title: "form-title",
      name: "name",
      description: "description",
      ok: "button-ok",
      cancel: "button-cancel"
    };
  }
  static get markup() {
    return `
      <form>
        <label data-id="${this.ctrlId.title}">Добавить тикет</label>
        <label>Краткое описание<input type="text" name="name" data-id="${this.ctrlId.name}" required></label>
        <label>Подробное описание</label>
        <textarea name="description" data-id="${this.ctrlId.description}" rows="3" required></textarea>
        <div class="buttons">
          <button class="help-desk-button" type="reset" data-id="${this.ctrlId.cancel}">Отмена</button>
          <button class="help-desk-button" type="submit" data-id="${this.ctrlId.ok}">Ok</button>
        </div>      
      </form>
    `;
  }
  static get formSelector() {
    return `[data-widget=${this.ctrlId.form}]`;
  }
  static get titleSelector() {
    return `[data-id=${this.ctrlId.title}]`;
  }
  static get nameSelector() {
    return `[data-id=${this.ctrlId.name}]`;
  }
  static get descriptionSelector() {
    return `[data-id=${this.ctrlId.description}]`;
  }
  static get cancelSelector() {
    return `[data-id=${this.ctrlId.cancel}]`;
  }
  static get okSelector() {
    return `[data-id=${this.ctrlId.ok}]`;
  }
  bindToDOM() {
    this.container = document.createElement("div");
    this.container.className = "help-desk-modal-form";
    this.container.dataset.widget = this.constructor.ctrlId.form;
    this.container.innerHTML = this.constructor.markup;
    document.body.appendChild(this.container);
    this.form = this.container.querySelector("form");
    this.title = this.form.querySelector(this.constructor.titleSelector);
    this.name = this.form.querySelector(this.constructor.nameSelector);
    this.description = this.form.querySelector(this.constructor.descriptionSelector);
    this.ok = this.form.querySelector(this.constructor.okSelector);
    this.form.addEventListener("submit", this.onSubmit.bind(this));
    this.form.addEventListener("reset", this.onReset.bind(this));
    this.ok.addEventListener("click", this.validation.bind(this));
  }
  async onSubmit(event) {
    event.preventDefault();
    const params = {
      data: {
        method: "createTicket",
        id: this.id,
        status: this.status,
        name: this.name.value,
        description: this.description.value
      },
      responseType: "json",
      method: "POST"
    };
    try {
      this.parentWidget.redraw(await runRequest(params));
    } catch (error) {
      alert(error);
    }
    this.onReset();
  }
  onReset() {
    this.container.classList.remove("modal-active");
  }
  validation() {
    this.name.value = this.name.value.trim();
    this.description.value = this.description.value.trim();
  }
  async show(ticket) {
    if (ticket) {
      this.title.textContent = "Изменить тикет";
      this.id = ticket.dataset.index;
      const status = ticket.querySelector(this.parentWidget.constructor.statusSelector);
      this.status = status.textContent === "\u2713" ? "true" : "false";
      const name = ticket.querySelector(this.parentWidget.constructor.nameSelector);
      this.name.value = name.textContent;
      this.description.value = await this.parentWidget.constructor.getDescription(this.id);
    } else {
      this.title.textContent = "Добавить тикет";
      this.id = "";
      this.status = "";
      this.name.value = "";
      this.description.value = "";
    }
    this.container.classList.add("modal-active");
  }
}
;// CONCATENATED MODULE: ./src/js/DeleteForm.js
/* eslint-disable no-alert */


class DeleteForm {
  constructor(parentWidget) {
    this.parentWidget = parentWidget;
  }
  static get ctrlId() {
    return {
      form: "delete-form",
      title: "form-title",
      cancel: "button-cancel",
      ok: "button-ok"
    };
  }
  static get markup() {
    return `
      <form>
        <label data-id="${this.ctrlId.title}">Удалить тикет</label>
        <label>Вы уверены, что хотите удалить тикет? Это действие необратимо.</label>
        <div class="buttons">
          <button class="help-desk-button" type="reset" data-id="${this.ctrlId.cancel}">Отмена</button>
          <button class="help-desk-button" type="submit" data-id="${this.ctrlId.ok}">Ok</button>
        </div>      
      </form>
    `;
  }
  static get formSelector() {
    return `[data-widget=${this.ctrlId.form}]`;
  }
  static get titleSelector() {
    return `[data-id=${this.ctrlId.title}]`;
  }
  static get cancelSelector() {
    return `[data-id=${this.ctrlId.cancel}]`;
  }
  static get okSelector() {
    return `[data-id=${this.ctrlId.ok}]`;
  }
  bindToDOM() {
    this.container = document.createElement("div");
    this.container.className = "help-desk-modal-form";
    this.container.dataset.widget = this.constructor.ctrlId.form;
    this.container.innerHTML = this.constructor.markup;
    document.body.appendChild(this.container);
    this.form = this.container.querySelector("form");
    this.title = this.form.querySelector(this.constructor.titleSelector);
    this.form.addEventListener("submit", this.onSubmit.bind(this));
    this.form.addEventListener("reset", this.onReset.bind(this));
  }
  async onSubmit(event) {
    event.preventDefault();
    const params = {
      data: {
        method: "deleteTicket",
        id: this.id
      },
      responseType: "json",
      method: "POST"
    };
    try {
      this.parentWidget.redraw(await runRequest(params));
    } catch (error) {
      alert(error);
    }
    this.onReset();
  }
  onReset() {
    this.container.classList.remove("modal-active");
  }
  show(ticket) {
    this.id = ticket.dataset.index;
    this.container.classList.add("modal-active");
  }
}
;// CONCATENATED MODULE: ./src/js/Widget.js
/* eslint-disable no-alert */



class Widget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.productList = [];
  }
  static get ctrlId() {
    return {
      widget: "help-desk-widget",
      add: "button-add",
      tickets: "tickets",
      ticket: "ticket",
      status: "button-status",
      text: "text",
      name: "name",
      description: "description",
      created: "created",
      edit: "button-edit",
      delete: "button-delete"
    };
  }
  static get markup() {
    return `
      <div class="header">
        <button class="help-desk-button" data-id="${this.ctrlId.add}">Добавить тикет</button>
      </div>
      <div data-id="${this.ctrlId.tickets}">
      </div>
    `;
  }
  static get widgetSelector() {
    return `[data-widget=${this.ctrlId.widget}]`;
  }
  static get addSelector() {
    return `[data-id=${this.ctrlId.add}]`;
  }
  static get ticketsSelector() {
    return `[data-id=${this.ctrlId.tickets}]`;
  }
  static get ticketSelector() {
    return `[data-id=${this.ctrlId.ticket}]`;
  }
  static get statusSelector() {
    return `[data-id=${this.ctrlId.status}]`;
  }
  static get textSelector() {
    return `[data-id=${this.ctrlId.text}]`;
  }
  static get nameSelector() {
    return `[data-id=${this.ctrlId.name}]`;
  }
  static get descriptionSelector() {
    return `[data-id=${this.ctrlId.description}]`;
  }
  static get createdSelector() {
    return `[data-id=${this.ctrlId.created}]`;
  }
  static get editSelector() {
    return `[data-id=${this.ctrlId.edit}]`;
  }
  static get deleteSelector() {
    return `[data-id=${this.ctrlId.delete}]`;
  }
  async bindToDOM() {
    this.widget = document.createElement("div");
    this.widget.dataset.widget = this.constructor.ctrlId.widget;
    this.widget.innerHTML = this.constructor.markup;
    this.parentEl.appendChild(this.widget);
    this.addButton = this.widget.querySelector(this.constructor.addSelector);
    this.tickets = this.widget.querySelector(this.constructor.ticketsSelector);
    this.deleteForm = new DeleteForm(this);
    this.deleteForm.bindToDOM();
    this.editForm = new EditForm(this);
    this.editForm.bindToDOM();
    this.addButton.addEventListener("click", this.onAddButtonClick.bind(this));
    this.tickets.addEventListener("click", this.onTicketsClick.bind(this));
    const params = {
      data: {
        method: "allTickets"
      },
      responseType: "json",
      method: "GET"
    };
    try {
      this.redraw(await runRequest(params));
    } catch (error) {
      alert(error);
    }
  }
  async onAddButtonClick(event) {
    event.preventDefault();
    await this.editForm.show();
  }
  async onTicketsClick(event) {
    event.preventDefault();
    const ticket = event.target.closest(this.constructor.ticketSelector);
    switch (event.target.dataset.id) {
      case this.constructor.ctrlId.status:
        await this.invertStatus(ticket);
        break;
      case this.constructor.ctrlId.edit:
        await this.editForm.show(ticket);
        break;
      case this.constructor.ctrlId.delete:
        this.deleteForm.show(ticket);
        break;
      default:
        await this.constructor.invertVisibleDescription(ticket);
    }
  }
  redraw(response) {
    this.tickets.innerHTML = response.reduce((str, {
      id,
      status,
      created
    }) => `
      ${str}
      <div data-id="${this.constructor.ctrlId.ticket}" data-index="${id}">
        <button class="help-desk-ticket-button" data-id="${this.constructor.ctrlId.status}">${status === "true" ? "&#x2713;" : "&#x00A0;"}</button>
        <div class="text" data-id="${this.constructor.ctrlId.text}">
          <p data-id="${this.constructor.ctrlId.name}"></p>
        </div>
        <p data-id="${this.constructor.ctrlId.created}">${this.constructor.dateToString(created)}</p>
        <button class="help-desk-ticket-button" data-id="${this.constructor.ctrlId.edit}">&#x270E;</button>
        <button class="help-desk-ticket-button" data-id="${this.constructor.ctrlId.delete}">&#x2716;</button>
      </div>
    `, "");
    this.tickets.querySelectorAll(this.constructor.nameSelector).forEach((item, i) => {
      const name = item;
      name.textContent = response[i].name;
    });
  }
  static dateToString(timestamp) {
    const date = new Date(timestamp);
    const result = `0${date.getDate()}.0${date.getMonth() + 1}.0${date.getFullYear() % 100} 0${date.getHours()}:0${date.getMinutes()}`;
    return result.replace(/\d(\d{2})/g, "$1");
  }
  static async getDescription(id) {
    const params = {
      data: {
        method: "ticketById",
        id
      },
      responseType: "text",
      method: "GET"
    };
    try {
      return await runRequest(params);
    } catch (error) {
      alert(error);
      return null;
    }
  }
  async invertStatus(ticket) {
    const id = ticket.dataset.index;
    const status = ticket.querySelector(this.constructor.statusSelector);
    const name = ticket.querySelector(this.constructor.nameSelector);
    const params = {
      data: {
        method: "createTicket",
        id,
        status: status.textContent === "\u2713" ? "false" : "true",
        name: name.textContent,
        description: await this.constructor.getDescription(id)
      },
      responseType: "json",
      method: "POST"
    };
    try {
      this.redraw(await runRequest(params));
    } catch (error) {
      alert(error);
    }
  }
  static async invertVisibleDescription(ticket) {
    const textContainer = ticket.querySelector(this.textSelector);
    let description = ticket.querySelector(this.descriptionSelector);
    if (description) {
      textContainer.removeChild(description);
      description = null;
    } else {
      description = document.createElement("p");
      description.dataset.id = this.ctrlId.description;
      textContainer.appendChild(description);
      description.textContent = await this.getDescription(ticket.dataset.index);
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const helpDesk = new Widget(document.querySelector(".container"));
helpDesk.bindToDOM();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;