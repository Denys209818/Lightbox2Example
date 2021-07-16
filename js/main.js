$(function () {
    //Кнопка, яка відкриває модальне вікно
    var $btnOpenModal = $("#btnOpenModal");
    //Модальне вікно Bootstrap4.6
    var $mainModal = $("#mainModal");
    //Кнопка для додання нового продукту
    var $btnSaveChanges = $("#btnSaveChanges");
    //Блок, який містить усі продукти
    var $productsBlock = $("#productsBlock");

    //Зона, в якій спрацьовує draganddrop
    var $dropzone = $("#dropzone");
    //Фотографія модального вікна bootstrap4.6
    var $selectImage = $("#selectImage");

    //Власне модальне вікно
    var $cropperModal = $("#cropperModal");
    //inputs
    var $txtName = $("#txtName");
    var $txtDesc = $("#txtDesc");
    var $txtPrice = $("#txtPrice");

    //Обробка події click для кнопки, що відкриває модальне вікно
    $btnOpenModal.on("click", function () {
        //Відображення модального вікна
        $mainModal.modal("show");
    });
    // Метод, який перевіряє усі дані на валідність
    function isValidation() 
    {
        // Змінна, яка містититиме інформацію чи валідні дані
        var isValid = true;
        // Перевірка назви продукта
        isValid = InputValidation(document.getElementById("txtName"));
        
        // Перевірка опису продукта
        isValid = InputValidation(document.getElementById("txtDesc"));
        
        // Перевірка ціни продукта
        isValid = InputValidation(document.getElementById("txtPrice"));
        
        // Перевірка зображення продукта
        if($("#imageCropper").attr("src") == "") 
        {
            isValid = false;
            $dropzone.addClass("is-invalid");
        }
        // Повернення результату валідації
        return isValid;
    }

    //Обробка події click для кнопки, яка зберігає новий продукт
    $btnSaveChanges.on("click", function () {
        if(isValidation()) 
        {
            //Додавання нового продукту у контейнер
            $productsBlock.prepend(`
            <div class="col-md-12">
            <div class="row p-2 bg-white border rounded mb-2">
                            <div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded product-image" 
                            src="${cropper.getCroppedCanvas().toDataURL()}"></div>
                            <div class="col-md-6 mt-1">
                                <h5>${$txtName.val()}</h5>
                                <div class="d-flex flex-row">
                                    <div class="ratings mr-2"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div><span>310</span>
                                </div>
                                <div class="mt-1 mb-1 spec-1"><span>100% cotton</span><span class="dot"></span><span>Light weight</span><span class="dot"></span><span>Best finish<br></span></div>
                                <div class="mt-1 mb-1 spec-1"><span>Unique design</span><span class="dot"></span><span>For men</span><span class="dot"></span><span>Casual<br></span></div>
                                <p class="text-justify text-truncate para mb-0">
                                    ${$txtDesc.val()}    
                                </p>
                            </div>
                            <div class="align-items-center align-content-center col-md-3 border-left mt-1">
                                <div class="d-flex flex-row align-items-center">
                                    <h4 class="mr-1">${$txtPrice.val()}</h4><span class="strike-text">$20.99</span>
                                </div>
                                <h6 class="text-success">Free shipping</h6>
                                <div class="d-flex flex-column mt-4"><button class="btn btn-primary btn-sm" type="button">Details</button><button class="btn btn-outline-primary btn-sm mt-2" type="button">Add to wishlist</button></div>
                            </div>
                        </div>
                    </div>
            `);

            // Очищення усіх input-ів і приховання модального вікна
            clearInputs();

            //Очищення блоку фотографії
            $("#imageCropper").attr("src", "");
        }
    });

    //Функція для очищення інпутів і закриття модального вікна
    function clearInputs()
    {
        //Очищення інпутів
        $txtName.val("");
        $txtDesc.val("");
        $txtPrice.val("");
        $selectImage.attr("src", "/images/gallery.jpg");

        // Видалення класів звязаних з валідацією
        $txtName.removeClass("is-valid");
        $txtName.removeClass("is-invalid");

        $txtDesc.removeClass("is-valid");
        $txtDesc.removeClass("is-invalid");

        $txtPrice.removeClass("is-valid");
        $txtPrice.removeClass("is-invalid");

        $dropzone.removeClass("is-valid");
        $dropzone.removeClass("is-invalid");

        //Закриття модального вікна
        $mainModal.modal("hide");
    }

    $mainModal.on("click", "[data-dismiss='modal']", clearInputs);
    $mainModal.on("click", "[data-dismiss='modal']", function () {
        //Очищення блоку фотографії
        $("#imageCropper").attr("src", "");
    });

    //Динамічна ініціалізація input
    var uploader;
    //Обробка події click для зони draganddrop
    $dropzone.on("click", function () {
        //Перевірка чи обєкт існує
        if (uploader)
            uploader.remove();
        //Ініціалізація нового input
        uploader = $(`<input type="file" class="d-none"/>`);
        //Динамічне нажаття на новий input
        uploader.click();

        //Оброблення події при зміні значення input
        uploader.on("input", function () {
            //  Метод, який відображає забраження у формі
            SaveImage(uploader[0]);
        });
    });

    //cropper
    var cropper;
    //Метод, який ініціалізує cropper
    function InitCropper()
    {
        //Перевірка чи існує cropper
        if (!cropper)
        {
            //Отримання тега img із DOM
            const img = document.getElementById("imageCropper");
            //Ініціалізація cropper
            cropper = new Cropper(img, {
                //Виставляє відношення сторін
                aspectRatio: 1 / 1,
                //Виставляє межі для вирізання зображення
                viewMode: 1,
                //Розмір області для вирізання зображення
                autoCropArea: 0.5
            });
        }
    }

    //draganddrop
    //Заборонення стандартної реалзації для draganddrop-зони
    $dropzone.on("dragenter", PreventDefaults);
    $dropzone.on("dragover", PreventDefaults);
    $dropzone.on("dragleave", PreventDefaults);
    $dropzone.on("drop", PreventDefaults);

    //Обролення подій, які задають стилі, коли зображення над дроп-зоною
    $dropzone.on("dragenter", DragIn);
    $dropzone.on("dragover", DragIn);
    //Обролення подій, які задають стилі, коли зображення покидає дроп-зону
    $dropzone.on("dragleave", DragOut);
    $dropzone.on("drop", DragOut);

    //Оброблення події, яка відображає на формі фотографію, яку перекинув користувач
    document.getElementById("dropzone").addEventListener("drop", SaveImage);


    //Скасування стандартної реалізації
    function PreventDefaults(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }

    //Задання стилів, які відображаються, коли користувач тримає зображення над дроп-зоною
    function DragIn()
    {
        //Додавання класа
        $dropzone.addClass("DragIn");
        //Видалення класа
        $dropzone.removeClass("border");
    }

    //Проведення пошуку в межах блоку модального вікна такого атрибуту і обробка для його події click
    $cropperModal.on("click", "[data-closeCustomDialog]", function () {
        //Очищення блоку фотографії
        $("#imageCropper").attr("src", "");
        //Ховання вікна
        $cropperModal.hide();
    });

    //Оброблення події, яка зберігає обрізану фотографію
    $("#btnCropImg").on("click", function () {
        //Задання значення атрибуту тега img
        $selectImage.attr("src", cropper.getCroppedCanvas().toDataURL());
        //Ховання власного модально вікна
        $cropperModal.hide();
        // Задання класу, який означає що дані валідні
        $dropzone.addClass("is-valid");
    });

    //Функція, яка задає стилі коли користувач опустив фотграфії або покинув дроп-зону
    function DragOut()
    {
        //Видалення класу
        $dropzone.removeClass("DragIn");
        //Додавання класу
        $dropzone.addClass("border");
    }

    var fileReader;

    function fileValidation(file) 
    {
        if(file.type.match(/^image\//)) 
        {
            return true;
        }
        return false;
    }

    //Метод, який отримує зображення і відображає його на формі
    function SaveImage(e)
    {
        //Ініціалізація Cropper
        InitCropper();
        var files;
        //Перевірка на наявність файлів
        if (e.files) {
            files = e.files;
            //Перевірка на наявність DataTransfer
        } else if (e.dataTransfer) {
            files = e.dataTransfer.files;
        }

        //Перевірка чи існують файли
        if (files)
        {
            //Перевірка чи існує перший файл
            if (files[0])
            {
                //Отримання першого файлу
                var file = files[0];
                
                if(fileValidation(file)) 
                {   
                    // Видалення класу не валідних данних
                    $dropzone.removeClass('is-invalid');
                    if(!fileReader) 
                    {
                        //Ініціалізація FileReader
                        fileReader = new FileReader();
                    }
                    //Подія, яка виникає, коли файл зчитано
                    fileReader.onload = function ()
                    {
                        //Виведення збраження для того щоб змінити.Виводить у тег,
                        //який переданий першим параметром при ініціалізації
                        cropper.replace(fileReader.result);
                    
                        //Відображення власного модального вікна
                        $cropperModal.show();
                    }
                    //Зчитування файлу
                    fileReader.readAsDataURL(file);
                }
                else 
                {
                    // Додання класу, який означає, що дані не валідні
                    $dropzone.addClass('is-invalid');
                }
            }
        }
    }

    // Validation
    $txtName.on("input", TextValidatorEvent);
    $txtDesc.on("input", TextValidatorEvent);
    $txtPrice.on("input", TextValidatorEvent);

    // Отримання поля ціни для задання маски
    var currency = document.getElementById("txtPrice");
    
    // Ініціалізація маски
    var mask = IMask(currency, {
        // Маска
        mask: "₴ num",
        // Блоки (Додаткові налаштування)
        blocks: 
        {
            // Вложена маска для коректної роботи
            num: 
            {
                // Маска
                mask: Number,
                // Розділятор тисяч
                thousandsSeparator: ' '
            }
        }
    });


    // Функція, яка валідує текст
    function TextValidatorEvent(e) 
    {
        if(e.target.value == "₴" && e.target.id == "txtPrice") 
        {
            e.target.value = ""; 
        }
        InputValidation(e.target);
    }

    function InputValidation(inputElement) 
    {
        // Перевірка чи поле не пусте   
        if(inputElement.value == "") 
        {
            // Відображення негативного результату
            isInValid(inputElement);
            return false;
        }else 
        {
            // Відображення позитивного результату
            isValid(inputElement);
            return true;
        }
    }

    // Функція, яка задає налаштування, коли значення валідне
    function isValid(inputElement) 
    {
        // Додавання класа
        inputElement.classList.add("is-valid");
        // Видалення класа
        inputElement.classList.remove("is-invalid");
    }

    // Функція, яка задає налаштування, коли значення не валідне
    function isInValid(inputElement) 
    {
        // Видалення класа
        inputElement.classList.remove("is-valid");
        // Додавання класа
        inputElement.classList.add("is-invalid");
    }
});