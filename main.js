var data = []
var lastId = '';
// get values from input fields
function getValues() {
    var productSku = $("#product_sku").val()
    var productName = $("#product_name").val()
    var productPrice = $("#product_price").val()
    var productQuantity = $("#product_quantity").val()
    return { "productSku": productSku, "productName": productName, "productPrice": productPrice, "productQuantity": productQuantity }
}

function validateData(object, isAdd) {
    console.log(object)
    // checking if fields are empty
    var empty = []
    var errors = []
    if (object.productSku == '') {
        empty.push("product_sku")
        notification("error", "* SKU field is empty")
    }
    if (object.productName == '') {
        empty.push("product_name")
        notification("error", "* Product Name field is empty")

    }
    if (object.productPrice == '') {
        empty.push("product_price")
        notification("error", "* Product Price field is empty")

    }
    if (object.productQuantity == '') {
        empty.push("product_quantity")
        notification("error", "* Product Quantity field is empty")
    }
    // checking for wrong values
    if (object.productSku != '') {
        if (isNaN(parseInt(object.productSku))) {
            errors.push("product_sku")
            notification("error", "* SKU field should be integer")
        }
        else {
            if (isAdd == true) {
                if ((isAlreadyExists(object.productSku))) {
                    errors.push("product_sku")
                    notification("error", `* id ${object.productSku} already exists`)
                }
            }
        }
    }
    if (object.productPrice != '') {
        if (isNaN(parseInt(object.productPrice))) {
            errors.push("product_price")
            notification("error", "* Product Price field should be integer or Float")
        }
    }
    if (object.productQuantity != '') {
        if (isNaN(parseInt(object.productQuantity))) {
            errors.push("product_quantity")
            notification("error", "* Product Quantity should be integer")
        }
    }
    return { 'errors': errors, 'empty': empty }
}


function isAlreadyExists(id) {
    for (let index = 0; index < data.length; index++) {
        if (data[index].productSku == id) {
            return true
        }
    }
    return false
}

// render border for errors or indications
function renderErrorBorder(id, iserror = true) {
    $(`#${id}`).css("border", iserror ? "1px solid red" : "1px solid black")
}

function resetErrors() {
    var ids = ["product_sku", "product_price", "product_quantity", "product_name"]
    ids.forEach(i => {
        renderErrorBorder(i, false)
    })
}

function showErrors(x) {
    if (x['empty'].length == 0 && x['errors'].length == 0) {
        return true
    }
    x['empty'].forEach(i => {
        console.log(i)
        renderErrorBorder(i)
    });
    x['errors'].forEach(i => {
        console.log(i)
        renderErrorBorder(i)
    });
    return false
}

function populateForm(object) {
    $("#product_sku").val(object.productSku)
    $("#product_name").val(object.productName)
    $("#product_price").val(object.productPrice)
    $("#product_quantity").val(object.productQuantity)
    lastId = object.productSku
}



// notification method
function notification(type, content) {
    var markup = `<div class="${type}">${content}<a href="#" class="close">X</a></div>`
    $("#notification").prepend(markup)
}

function clearAllNotifications() {
    $("#notification").empty()
}
function renderTable(id) {
    $(`#${id}`).empty()
    var markup = `<table>`
    markup += `
        <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
        </tr>
    `
    for (let index = 0; index < data.length; index++) {
        markup += `
            <tr>
                <td>${data[index].productSku}</td>
                <td>${data[index].productName}</td>
                <td>USD ${data[index].productPrice}</td>
                <td>${data[index].productQuantity}</td>
                <td><a href="#" id="edit" pid="${data[index].productSku}">Edit</a> <a href="#" id="delete" pid="${data[index].productSku}">Delete</a></td>
            </tr>
        `
    }
    markup += `</table>`
    console.log("table append to " + id)
    console.log(markup)
    $(`#${id}`).append(markup)
    console.log("table generated")
}
function askToDelte(productsku) {
    if (confirm("Are you Sure")) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].productSku == productsku) {
                data.splice(index, 1)
                notification("error", `SKU ${productsku} got successfully deleted`)
                renderTable("table")
                break
            }

        }
        console.log("delete")
    }
    else {
        console.log("do not delete")
    }
}
// clearing the form
function clearForm() {
    $("#product_sku").val('')
    $("#product_name").val('')
    $("#product_price").val('')
    $("#product_quantity").val('')
}

//editing function
function edit(object) {
    populateForm(object)
    $("#add_product").css("display", "none")
    $("#update_product").css("display", "block")
}

$("#update_product").click(function () {
    var object = getValues()
    var x = validateData(object, isAdd = false)
    if (showErrors(x)) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].productSku == lastId) {
                data[index] = getValues()
                resetErrors()
                clearAllNotifications()
                notification("success", `SKU ${data[index].productSku} got successfully updated`)
                renderTable("table")
                $("#add_product").css("display", "block")
                $("#update_product").css("display", "none")
                break
            }

        }
        renderTable("table")
        clearForm()
    }
})

// binding events
$("#add_product").click(function (e) {
    clearAllNotifications()
    e.preventDefault()
    resetErrors()
    var object = getValues()
    var x = validateData(object, isAdd = true)
    console.log(x)
    if (showErrors(x)) {
        console.log("x is ", object)
        data.push(object)
        renderTable("table")
        clearForm()
    }

})


$("body").on("click", "#edit", function (e) {
    // fetching the object by id
    for (let index = 0; index < data.length; index++) {
        if (data[index].productSku == $(this).attr("pid")) {
            edit(data[index])
            break
        }

    }
})
$("body").on("click", "#delete", function (e) {
    clearAllNotifications()
    askToDelte($(this).attr("pid"))
})


// close notificaiotns
$("body").on("click", ".close", function (e) {
    $(this).parent().hide()
})