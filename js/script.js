"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);
//отримуємо дані форми
        let formData = new FormData(form);
        //додаємо у формдата ще зображення
        formData.append('image', formImage.files[0]);
//якщо помилок немає
        if (error === 0) {  
            //як тільки переконались, щось немає помилок, додаємо новий клас до форми
            form.classList.add('_sending')
            // робимо відправку форми
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            })
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';
                form.reset();
                form.classList.remove('_sending')
            } else {
                alert("Error during form sending")
                form.classList.remove('_sending')
            }

            // в іншому випадку виводимо повідомлення про помилку
        } else {
            alert("Please fill in all required fields")
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req')
        //проходимось по полях з класом _req
        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);
            //перевіряємо чи поле емейл, валідація і помилка, якщо не проходить
            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
                //чи це чекбокс і чи він чекнутий
            } else if (input.getAttribute('type') === 'checkbox' && input.checked == false) {
                formAddError(input);
                error++;
            } else {
                //чи не порожнє поле
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }
    //функція додає батьківському елементу та інпуту клас error
    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    //функція видаляє батьківському елементу та інпуту клас error
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error')
    }
    //тест валідації пошти
    function emailTest(input) {
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.value);
    }
    
    //отримуємо input для додавання файлу у змінну
    const formImage = document.getElementById('formImage');
    //отримуємо div для preview файлу у змінну
    const formPreview = document.getElementById('formPreview');
    //слухач на зміну в інтупі
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0])
    });

    function uploadFile(file) {
        //перевіряємо тип файлу
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert("Accept only picture file")
            formImage.value = '';
            return;
        }
        //перевіряємо розмір файлу
        if (file.size > 2 * 1024 * 1024) {
            alert("File should has max 2mb");
            return;
        }
//виводимо preview картинки
        let reader = new FileReader();
        //коли файл успішно завантажено, ми відправляємо зображення
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="photo">`;
        };
        //у випадку помилки, її виводимо
        reader.onerror = function (e) {
            alert('Error')
        };
        reader.readAsDataURL(file);

    }

});