//--------------------------Main-Var-----------------------------

    //--------modal
    let modal = document.getElementById("modal");
    let closeH = document.getElementById("closeH");
    let btnAddContact = document.getElementById("btn-addContact");

    //--------main
    let main = document.getElementById("main");
    let btnContacts = document.getElementById("btn-contacts");

    //--------input
    let name = document.getElementById('inputName');
    let tel = document.getElementById('inputTel');

    //--------contactsBlock
    let contactsBlock = document.getElementById('contacts');
    textBlock('The phone book is empty!');

    let search = document.getElementById('searchInput');

    let errorsBlock = document.getElementById('container-errors');

    let contact = new Array();
    let error = new Array();

//-----------------------checkbox-------------------------------

    let checkbox = 0;
    let favorites = document.getElementById('favorites');

    favorites.addEventListener('change', () => {
        if(favorites.checked ) {
            checkbox = 1;
        } else {
            checkbox = 0;
        }
    });

//-----------------------Search------------------------------

    search.oninput = function (){
        errorNull();
        let checkSearch = check(search, search.value, 'search');
        let notFound= document.getElementById('not-found');

        if(checkSearch){
            if(contact.length > 1){
                let val = this.value.trim();
                let counterRemote = contact.length;
                if(val != ''){
                    for (let i = 0; i < contact.length; i++){
                        let selector = "section[id='" + contact[i][3] + "']";

                        if (contact[i][0].search(val) == -1){
                            document.querySelector(selector).style.display = "none";
                            counterRemote--;
                        }else {
                            document.querySelector(selector).style.display = "flex";
                        }
                    }

                    if(counterRemote == 0) {
                        conditionInput (search, 'yellow');
                        modalFun(notFound, "flex");
                    }else {
                        conditionInput (search, 'grey');
                        modalFun(notFound, "none");
                    }

                }else {
                    modalFun(notFound, "none");
                    for (let i = 0; i < contact.length; i++){
                        let selector = "section[id='" + contact[i][3] + "']";
                        document.querySelector(selector).style.display = "flex";
                    }
                }
            }
        }
        errorOutput();
    }

//-----------------------ValNullInput---------------------------

    function valNull(input) { input.value = ""; }

//-----------------------Error---------------------------

    function errorFun(er) { error.push(er); }

//-----------------------ErrorOutput---------------------------

    function errorOutput() {
        for (let i = 0; i < error.length; i++){
            errorsBlock.innerHTML += "<span class='error'>" + error[i] + "</span>";
        }
    }

//-----------------------ErrorNull---------------------------

    function errorNull() {
        error = [];
        errorsBlock.innerHTML = "";
        conditionInput(name, 'grey');
        conditionInput(tel, 'grey');
    }

//-----------------------Modal--------------------------

    function modalFun(input, type) {
        input.style.display = type;
    }

//-----------------------TextBlock---------------------------

    function textBlock (text){
        contactsBlock.innerHTML = "<h4 id='empty'><strong>\n" + text + "</strong></h4>";
    }

//-----------------------conditionInput---------------------------

    function conditionInput (input, color){
        if (color == 'red'){
            input.style.border='1px solid #E15562';
        }else if(color == 'grey'){
            input.style.border='1px solid #D8DADB';
        }else if(color == 'yellow'){
            input.style.border='1px solid #FFC107';
        }
    }

//----------------------Check-----------------------------------

    function checkInput(input, name) {
        let regularExpression;

        if (name == "phone"){
            regularExpression = /^\+7 \(\d\d\d\) \d\d\d-\d\d-\d\d$/;
        }else if(name == "name" || name == "search") {
            regularExpression = /^[a-zA-Zа-яА-Я']{1,10}?$/;
        }

        let valid = regularExpression.test(input);
        return valid;
    }
//----------------------Check-----------------------------------
    function check(input, val, type) {
        let key;
        if(type == "name" || type == "phone"){
            if(!checkInput(val, type)) {
                conditionInput(input, 'red');
                if(type == "name"){
                    errorFun("Name should only contain letters !");
                }else {
                    errorFun("Phone entered incorrectly!");
                }
                return false;
            }else  {
                conditionInput(input, 'grey');
            }

            if(type == "name"){
                key = 0;
            }else if(type == "phone"){
                key = 1;
            }

            for (let i = 0; i < contact.length; i++) {
                if(contact[i][key] == val) {
                    conditionInput(input, 'red');
                    if(type == "name"){
                        errorFun("Name already exists!");
                    }else {
                        errorFun("Phone already exists!");
                    }
                    return false;
                }else  {
                    conditionInput(input, 'grey');
                }
            }
            return true;
        }else if(type == "search"){
            if (val != "") {
                if (!checkInput(val, type)) {
                    conditionInput(input, 'red');
                    errorFun("Search should only contain letters!");
                    return false;
                } else {
                    conditionInput(input, 'grey');
                }
            }else {
                conditionInput(input, 'grey');
            }
            return true;
        }else {
            alert('err');
        }
    }

//----------------------Sorting-----------------------------------

    function Sorting() {
        //---Sort by Name
        let contactArrName = new Array(); // sorted array of names

        //copying names from the original array
        for (let i = 0; i < contact.length; i++){
            contactArrName[i] = contact[i][0];
        }

        contactArrName.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);

        //sort by pattern (contactArrName)
        for (let i = 0; i < contact.length; i++){
            for (let j = 0; j < contactArrName.length; j++){
                if (contact[i][0] == contactArrName[j]) {
                    let t = contact[j];
                    contact[j] = contact[i];
                    contact[i] = t;
                }
            }
        }

        //---Sort by Favorites
        for (let i = 0; i < contact.length; i++){
            for (let j = 0; j < contact.length-1; j++){
                if (contact[j][2] < contact[j + 1][2]) {
                    let zam = contact[j];
                    contact[j] = contact[j + 1];
                    contact[j + 1] = zam;
                }
            }
        }
    }

// ----------------------OutPut-----------------------------------

    function outPut() {
        //--contactsBlock null
        contactsBlock.innerHTML = "";

        for (let i = 0; i < contact.length; i++){
            let like, img;

            //----Heart condition
            if(contact[i][2] > 0) {
                like = "<i class=\"fa fa-heart contact-like\" aria-hidden=\"true\" id='" + contact[i][3] + "' onclick=\"likeContact(this.id)\"></i>";
            }else {
                like = "<i class=\"fa fa-heart-o\" aria-hidden=\"true\" id='" + contact[i][3] + "' onclick=\"likeContact(this.id)\"></i>";
            }
            //----Restriction on images
            if(contact[i][3] > 30) {
                img = 31;
            }else {
                img = contact[i][3];
            }
            //----OutPut
            contactsBlock.innerHTML += "" +
                "<section class=\"contact\"  id=" + contact[i][3] + ">" +
                "<img src='img/" + img + ".jpg' class=\"photo-contact\">" +
                "<div class=\"info-contact\">" +
                "<span class=\"name-contact\">" + contact[i][0] + "</span>" +
                "<span class=\"phone-contact\">" + contact[i][1] + "</span>" +
                "</div>" +
                "<div class=\"icon-btn\">" +
                "<i id='" + contact[i][3] + "' onclick=\"closeContact(this.id)\" class=\"fa fa-times contact-close\" aria-hidden=\"true\" ></i>" +
                like +
                "</div>"
            "</section>";
        }
    }

//----------------------MaskInputPhone--------------------------------

    function maskPhone(selector, masked = '+7 (___) ___-__-__') {

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            console.log(template);
            let i = 0,
                newValue = template.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = newValue.indexOf("_");
            if (i !== -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type === "blur" && this.value.length < 5) {
                this.value = "";
            }
        }
        tel.addEventListener("input", mask);
        tel.addEventListener("focus", mask);
        tel.addEventListener("blur", mask);
    }
    maskPhone ();

//----------------------OnClick--------------------------------

    //--------modal on
    btnContacts.onclick = function(){
        //--close main
        modalFun(modal, 'flex');
        modalFun(main, 'none');
        //--null search
        valNull(search);
    }

    //--------modal off
    closeH.onclick = function(){
        //--Null
        errorNull();
        valNull(name);
        valNull(tel);
        //--close modal
        modalFun(modal, 'none');
        modalFun(main, 'flex');
    }

    //--------closeContact
    function closeContact(clicked_id) {
        for (let i = 0; i < contact.length; i++) {
            //--OutPut contact
            if(contact[i][3] == clicked_id) {
                contact.splice(i, 1);
                outPut();
            }
            //--Empty contact
            if(contact.length == 0) {
                textBlock('The phone book is empty!');
            }
        }
        //--null search
        valNull(search);
    }

    //--------likeContact
    function likeContact(clicked_id) {
        for (let i = 0; i < contact.length; i++) {
            if(contact[i][3] == clicked_id) {
                if(contact[i][2] == 0){
                    contact[i][2] = 1;
                }else if(contact[i][2] == 1){
                    contact[i][2] = 0;
                }else {
                    alert("err");
                }
            }
        }
        Sorting();
        outPut();
        valNull(search);
    }

    //--------AddContact
    let idContact = 0;
    btnAddContact.onclick = function(){

        errorNull();

        let nameValue = name.value;
        let telValue = tel.value;
        let checkTel, checkName;

        //--Check empty Phone
        if(telValue === ""){
            errorFun("Phone must not be empty!");
            conditionInput(tel, 'red');
        }else {
            //--Check Phone
            checkTel = check(tel, telValue, 'phone');
        }

        //--Check empty Name
        if(nameValue === ""){
            errorFun("Name must not be empty!");
            conditionInput(name, 'red');
        }else {
            //--Check length Name
            if(nameValue.length < 3){
                errorFun("Name too small (min of 3 letters)!");
                conditionInput(name, 'red');
            }else if(nameValue.length > 10){
                errorFun("Name too large (max of 10 letters)!");
                conditionInput(name, 'red');
            }else {
                //--Check Name
                checkName = check(name, nameValue, 'name');
            }
        }

        if(checkName && checkTel){
            //----------PushContact
            contact.push([nameValue, telValue, checkbox, idContact++]);

            //--Close modal
            modalFun(modal, 'none');
            modalFun(main, 'flex');

            //--Input null
            valNull(name);
            valNull(tel);

            Sorting();
            outPut();
        }
        errorOutput();
    }