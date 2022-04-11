$(function () {
    loadRecipies();
    $("#recipes").on("click", ".btn-danger", handleDelete);
    $("#recipes").on("click", ".btn-warning", handleUpdate);
    $("#addBtn").click(addRecipe);
    $("#updateSave").click(function () {
        var id = $("#updateId").val();
        var title = $("#updateTitle").val();
        var body = $("#updateBody").val();

        if (title.length < 5) {
            $("#updateHelp").html(
                "Recipe Must Have a Title with minimum 5 characters"
            );
        } else {
            $.ajax({
                url: "https://usman-recipes.herokuapp.com/api/recipes/" + id,
                data: { title, body },
                method: "PUT",
                error: function (err) {
                    $("#updateHelp").html(
                        "There is something wrong, Try again!"
                    );
                },
                success: function (response) {
                    console.log(response);
                    loadRecipies();
                    $("#updateHelp").html("");
                    $("#updateModal").modal("hide");
                },
            });
        }
    });
});
function handleUpdate() {
    var btn = $(this);
    var parentDiv = btn.closest(".recipe");
    let id = parentDiv.attr("data-id");
    $.get(
        "https://usman-recipes.herokuapp.com/api/recipes/" + id,
        function (response) {
            $("#updateId").val(response._id);
            $("#updateTitle").val(response.title);
            $("#updateBody").val(response.body);
            $("#updateModal").modal("show");
        }
    );
}
function addRecipe() {
    var title = $("#title").val();
    var body = $("#body").val();

    if (title.length < 5) {
        $("#Help").html(
            "New Recipe Must Have a Title with minimum 5 characters"
        );
    } else {
        $.ajax({
            url: "https://usman-recipes.herokuapp.com/api/recipes",
            method: "POST",
            data: { title, body },
            error: function (err) {
                $("#Help").html("There is something wrong, Try again!");
            },
            success: function (response) {
                console.log(response);
                $("#title").val("");
                $("#body").val("");
                $("#Help").html("");
                loadRecipies();
                $("#addModal").modal("hide");
            },
        });
    }
}

function handleDelete() {
    var btn = $(this);
    var parentDiv = btn.closest(".recipe");
    let id = parentDiv.attr("data-id");
    console.log(id);
    $.ajax({
        url: "https://usman-recipes.herokuapp.com/api/recipes/" + id,
        method: "DELETE",
        success: function () {
            loadRecipies();
        },
    });
}
function loadRecipies() {
    $.ajax({
        url: "https://usman-recipes.herokuapp.com/api/recipes",
        method: "GET",
        error: function (response) {
            var recipes = $("#recipes");
            recipes.html("An Error has occured");
        },
        success: function (response) {
            console.log(response);
            var recipes = $("#recipes");
            recipes.empty();
            for (var i = 0; i < response.length; i++) {
                var rec = response[i];
                recipes.append(
                    `<div class="recipe" data-id="${rec._id}"><h3>${rec.title}</h3><p><button class="btn btn-danger btn-sm float-right">delete</button><button class="btn btn-warning btn-sm float-right">Edit</button> ${rec.body}</p></div>`
                );
                // recipes.append("<div><h3>" + rec.title + "</h3></div>");
            }
        },
    });
}
