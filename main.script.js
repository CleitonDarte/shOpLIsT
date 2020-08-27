'use strict';

class ShopList {

    #initialHtml = `
        <header>
            <input id="newArticle" type="text" autofocus placeholder="Novo Item"><span id="addArticle"><i class="fas fa-plus"></i></span>
        </header>
        <main></main>
    `;

    #initialoffsetX;
    #swipeDiff;

    constructor() {
        document.body.innerHTML = this.#initialHtml;
        document.querySelector('#addArticle').addEventListener('click', e => { this.#addNewArticle() });
        document.querySelector('#newArticle').addEventListener('keyup', e => { e.keyCode == 13 && this.#addNewArticle() });

        this.#loadArticles();
    }

    #getStoredArticles() {
        return localStorage.a ? JSON.parse(atob(localStorage.a)) : [];
    }

    #storeArticles(articlesToStore) {
        localStorage.a = btoa(JSON.stringify(articlesToStore));
        this.#loadArticles();
    }

    #loadArticles() {
        document.querySelector('body main').innerHTML = '';
        let sa = this.#getStoredArticles();
        for (let art of sa) {
            document.querySelector('body main').appendChild(this.#htmlContent(art.class, art.name));
        }
    }

    #htmlContent(a_class, a_name) {
        let _article = document.createElement('article');
        _article.className = a_class;
        _article.draggable = true;
        _article.ondragstart = (e) => { this.#articleAction(0, e, a_name) };
        _article.ondrag = (e) => { this.#articleAction(1, e, a_name) };
        _article.ondragend = (e) => { this.#articleAction(2, e, a_name) };

        _article.onclick = (e) => { this.#doTheThing(a_name, 'basket') };
        _article.ondblclick = (e) => { this.#doTheThing(a_name, 'trash') };
        _article.innerHTML = `<h4>${a_name}</h4>`;

        return _article;
    }

    #articleAction(action, art, artName) {
        this.#initialoffsetX = action == 0 ? art.offsetX : this.#initialoffsetX;
        // action == 0 && (document.getElementById('ival').innerText = art.offsetX);
        if (action == 1) {

            if (this.#initialoffsetX <= art.offsetX) {
                this.#swipeDiff = art.offsetX - this.#initialoffsetX;
                art.srcElement.style.borderRight = 'none';
                this.#swipeDiff < 50 && (art.srcElement.style.borderLeft = `${this.#swipeDiff}px solid green`);
            } else {
                this.#swipeDiff = this.#initialoffsetX - art.offsetX;
                art.srcElement.style.borderLeft = '5px solid #eee';
                this.#swipeDiff < 50 && (art.srcElement.style.borderRight = `${this.#swipeDiff}px solid red`);
            }
        }
        if (action == 2) {
            art.srcElement.style.borderLeft = '5px solid #eee';
            art.srcElement.style.borderRight = 'none';

            if (this.#swipeDiff >= 50 && this.#initialoffsetX < art.offsetX) {
                art.srcElement.classList[0] == 'new' && this.#doTheThing(artName, 'basket');
                art.srcElement.classList[0] == 'del' && this.#doTheThing(artName, 'shop');
                art.srcElement.classList[0] == 'shp' && this.#doTheThing(artName, 'basket');
            }

            if (this.#swipeDiff >= 50 && this.#initialoffsetX > art.offsetX) {
                art.srcElement.classList[0] == 'new' && this.#doTheThing(artName, 'trash');
                art.srcElement.classList[0] == 'del' && this.#doTheThing(artName, 'delete');
                art.srcElement.classList[0] == 'shp' && this.#doTheThing(artName, 'shop');
            }
        }
    }

    #addNewArticle() {
        let sa = localStorage.a ? JSON.parse(atob(localStorage.a)) : [];
        let _new = document.getElementById('newArticle').value;
        if (!!_new) {
            sa.push({ name: _new, class: 'new' });
            this.#storeArticles(sa);
            document.getElementById('newArticle').value = '';
        }
    }

    #doTheThing(artName, action) {
        let sa = this.#getStoredArticles();
        let newSa = [];
        for (let art of sa) {
            action == 'delete' && art.name != artName && newSa.push(art);

            action == 'basket' && art.name == artName && (art.class = 'shp');
            action == 'basket' && newSa.push(art);

            action == 'shop' && art.name == artName && (art.class = 'new');
            action == 'shop' && newSa.push(art);

            action == 'trash' && art.name == artName && (art.class = 'del');
            action == 'trash' && newSa.push(art);
        }

        this.#storeArticles(newSa);
    }
}

window.onload = () => { new ShopList() };