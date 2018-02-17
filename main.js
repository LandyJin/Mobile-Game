var globalID;
var globalStandID;
var level1Completed;
var isMoving = 0;
var isSceneMoving = 0;
var score = 0;
var life = 5;
var playerJumpHeight = 200;
var groundHeight = $(".ground").height();
var playerHeight = $("#Player").height();
//document Ready
$(document).ready(function () {

    //Play welcome screen background music
    var backgroundMusic = document.getElementById("WelcomeScreenSound");
    backgroundMusic.loop = true;
    backgroundMusic.play();

    //Welcome screen start button
    $(".button_start").on("click", function (e) {
        e.preventDefault();
        $("#WelcomeScreen").fadeOut();
        $("#LevelSelectionScreen").fadeIn();

    });
    //Welcome screen license link
    $(".license_link").on("click", function (e) {
        e.preventDefault();
        $("#WelcomeScreen").fadeOut();
        $("#LicenseScreen").fadeIn();

    });

    //License screen back to home link
    $(".back_to_home_link").on("click", function (e) {
        e.preventDefault();
        $("#LicenseScreen").fadeOut();
        $("#WelcomeScreen").fadeIn();

    });

    //Game over screen restart button
    $(".restart_bottom").on("click", function (e) {

        location.reload();

    });

    //Level selection screen level 1 start button
    $(".level_1_start").on("click", function () {

        //fade out level selection screen
        $("#LevelSelectionScreen").fadeOut();
        //fade in level 1 screen
        $("#Level1").fadeIn();

        // Stop welcome screen music playing
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        //level 1 screen help button
        $('#Level1 #help_button').on('click', function () {

            //pause all moving object
            pause(true);
            //add grey shade to level 1 main div
            $("#Level1").addClass("paused");
            //fade in help screen
            $("#Level1 #help_information_holder").fadeIn();
        });

        //help screen close button
        $('#Level1 .help_close_icon').on('click', function () {

            //fade out help screen
            $("#Level1 #help_information_holder").fadeOut();
            //remove level 1 div shade
            $("#Level1").removeClass("paused");
            //resume game
            pause(false);
        });

        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        var level1MovingId;
        var level1ChangePlayerImageId;
        var level1JumpId;
        var screenFrame = 0;
        var frame = 0;


        //call function to generate level 1 screen objects
        generateLevel1Screen();

        $(".scene").autoRemoveOffScreen(false);
        resetLevel1Coins();
        resetEnemy();
        $(".coin").autoRemoveOffScreen(false);
        $(".enemy1").autoRemoveOffScreen(false);
        $(".brick_wall").autoRemoveOffScreen(false);
        $("#Level1 #Player").autoRemoveOffScreen(false);
        var coin = $(".coin");
        var player = $("#Level1 #Player");
        //set player on collision event
        player.onCollision(function (otherObject) {
            if (otherObject.hasClass("coin") && isMoving != 6) {
                otherObject.remove();
                score += 100;
                $("#Score").html("Score: " + score);
            }
            if (otherObject.hasClass("enemy1")) {
                if (otherObject.position().top + otherObject.height() <= player.position().top + player.height()) {
                    var previousMovingStatus = isMoving;
                    cancelAnimationFrame(level1ChangePlayerImageId);
                    cancelAnimationFrame(level1MovingId);
                    $("#Level1 #Player").removeClass();
                    isMoving = 6;
                    clearInterval(globalID);
                    player.moveTo(null);
                    $(".scene").moveTo(null);
                    $(".coin").moveTo(null);
                    $(".brick_wall").moveTo(null);
                    otherObject.remove();
                    player.css("background", "url('images/p3_hurt.png')").css("opacity", "0.7");
                    var playerTop = player.position().top;
                    player.speed(0.5);
                    player.moveTo(player.position().left, player.position().top - 100);
                    player.weight(0.2);
                    setTimeout(function () {
                        player.weight(0);
                        player.moveTo(180);

                    }, 500);
                    setTimeout(function () {
                        player.css("background", "url('images/p3_front.png')").css("opacity", "1");
                        if (previousMovingStatus == 1 || previousMovingStatus == 2) {
                            isMoving = 0;

                        }
                        else {
                            isMoving = previousMovingStatus;
                        }

                    }, 900);
                    life--;
                    $("#Life .text").html(life);
                    checkLife();
                }
                else {
                    otherObject.remove();
                    score += 100;
                    $("#Score").html("Score: " + score);
                }
            }

            if (otherObject.hasClass("ground")) {

                //clearInterval(globalID);
                cancelAnimationFrame(level1ChangePlayerImageId);
                cancelAnimationFrame(level1MovingId);
                cancelAnimationFrame(level1JumpId);
                $("#Level1 #Player").removeClass();
                player.weight(0);
                player.moveTo(null);
                $(".scene").moveTo(null);
                $(".coin").moveTo(null);
                $(".brick_wall").moveTo(null);
                $(".enemy1").speed(0.3);
                $(".enemy1").moveTo(270);
                player.css("background", "url('images/p3_front.png')");
                player.speed(100);
                player.moveTo(player.position().left, otherObject.position().top - player.height());
                function checkPlayerJumpForward() {
                    if (player.position().top == otherObject.position().top - player.height()) {

                        isMoving = 0;
                    }
                    level1MovingId = requestAnimationFrame(checkPlayerJumpForward);
                }
                level1MovingId = requestAnimationFrame(checkPlayerJumpForward);
            }
            if (otherObject.hasClass("stand1")) {

                if (($("#Level1 #Player").position().top + $("#Level1 #Player").width()) <= otherObject.position().top && isMoving != 6) {

                    clearInterval(globalID);
                    player.weight(0);
                    player.moveTo(null);
                    $(".scene").moveTo(null);
                    $(".coin").moveTo(null);
                    $(".stand1").moveTo(null);
                    isMoving = 0;
                    player.css("background", "url('images/p3_front.png')");
                }
                else if (isMoving != 6) {
                    clearInterval(globalID);
                    player.weight(0);
                    player.moveTo(null);
                    $(".scene").moveTo(null);
                    $(".coin").moveTo(null);
                    $(".stand1").moveTo(null);
                    isMoving = 8;
                    player.css("background", "url('images/p3_front.png')");
                }
            }
            if (otherObject.hasClass("brick_wall")) {
                var number = Math.floor((Math.random() * 4) + 1)
                if (number == 1) {

                    otherObject.css('background', 'url(images/hud_heartFull.png)').css('width', '53px').css('height', '45px').css('z-index', '9');
                    otherObject.speed(0.3);
                    otherObject.moveTo(45);
                    setTimeout(function () {
                        otherObject.fadeOut();
                    }, 500);
                    //otherObject.remove();
                    life++;
                    $("#Life .text").text(life);
                }
                else if (number == 4) {

                    otherObject.css('background', 'url(images/hud_p2Alt.png)').css('width', '47px').css('height', '47px').css('z-index', '9');
                    otherObject.speed(0.3);
                    otherObject.moveTo(135);
                    setTimeout(function () {
                        otherObject.fadeOut();
                    }, 500);
                    //otherObject.remove();
                    life--;
                    $("#Life .text").text(life);
                    checkLife();
                }
                else {

                    otherObject.css('background', 'url(images/hud_gem_blue.png)').css('width', '46px').css('height', '36px').css('z-index', '9');
                    otherObject.speed(0.3);
                    otherObject.moveTo(45);
                    setTimeout(function () {
                        otherObject.fadeOut();
                    }, 500);
                    //otherObject.remove();
                    score += 1000;
                    $("#Score").html("Score: " + score);
                }
            }

            if (otherObject.hasClass("fly")) {

                var previousMovingStatus = isMoving;
                cancelAnimationFrame(level1ChangePlayerImageId);
                cancelAnimationFrame(level1MovingId);
                $("#Level1 #Player").removeClass();
                isMoving = 6;
                clearInterval(globalID);
                player.moveTo(null);
                $(".scene").moveTo(null);
                $(".coin").moveTo(null);
                $(".brick_wall").moveTo(null);
                otherObject.remove();
                player.css("background", "url('images/p3_hurt.png')").css("opacity", "0.7");
                var playerTop = player.position().top;
                player.speed(0.5);
                player.moveTo(player.position().left, player.position().top - 100);
                player.weight(0.2);
                setTimeout(function () {
                    player.weight(0);
                    player.moveTo(180);

                }, 500);
                setTimeout(function () {
                    player.css("background", "url('images/p3_front.png')").css("opacity", "1");
                    if (previousMovingStatus == 1 || previousMovingStatus == 2) {
                        isMoving = 0;

                    }
                    else {
                        isMoving = previousMovingStatus;
                    }

                }, 900);
                life--;
                $("#Life .text").html(life);
                checkLife();
            }
        });

        var snail1MovingForward = false;
        $("#Snail1").onCollision(function (otherObject) {

            if (otherObject.hasClass("brick_wall")) {
                $("#Snail1").toggleClass("flipped");
                snail1MovingForward = !snail1MovingForward;
                if (snail1MovingForward) {
                    $("#Snail1").moveTo(90);
                }
                else {
                    $("#Snail1").moveTo(270);
                }
            }
        });


        $("body #RightButton").onTap(function () {

            moveRight();
        });

        $("body #LeftButton").onTap(function () {

            moveLeft();
        });

        $("body #JumpButton").onTap(function () {

            moveUp();
        });

        $("body").keydown(function (e) {
            if (e.keyCode == 39) { // right 
                moveRight();
            }
            else if (e.keyCode == 37) {
                moveLeft();
            }
            else if (e.keyCode == 32) {

                moveUp();
            }

        });

        //level 1 moving forward function
        function moveRight() {

            switch (isMoving) {
                case 0:
                    resetMoving($("#Level1 #Player"));
                    cancelAnimationFrame(level1ChangePlayerImageId);
                    cancelAnimationFrame(level1MovingId);
                    $("#Level1 #Player").removeClass();
                    if ($("#Level1 #Player").hasClass('flipped')) {
                        $("#Level1 #Player").removeClass('flipped');
                    }
                    function checkPlayerMovingForward() {

                        if (($("#Level1 #Player").position().left + $("#Level1 #Player").width() / 2) >= $(window).width() / 2) {
                            if ($("#Fly1").length > 0) {
                                $("#Fly1").css("left", $('#Fly1').position().left - 2);
                            }
                            $("#Level1 #Player").moveTo(null);
                            $(".scene").speed(0.5);
                            $(".scene").moveTo(270);
                            $(".enemy1").speed(0.8);
                            $(".enemy1").moveTo(270);
                            $(".coin").speed(0.5);
                            $(".coin").moveTo(270);
                            $(".brick_wall").speed(0.5);
                            $(".brick_wall").moveTo(270);
                            isSceneMoving = 1;
                            if ($("#Scene10").position().left <= 0) {
                                $(".scene").moveTo(null);
                                $(".coin").moveTo(null);
                                $(".brick_wall").moveTo(null);
                                isSceneMoving = 0;
                                playerMovingForward($("#Level1 #Player"));
                            }
                        }
                        else {
                            //call player right move function
                            $(".scene").moveTo(null);
                            $(".coin").moveTo(null);
                            $(".brick_wall").moveTo(null);
                            isSceneMoving = 0;
                            playerMovingForward($("#Level1 #Player"));
                        }
                        level1MovingId = requestAnimationFrame(checkPlayerMovingForward);
                    }
                    level1MovingId = requestAnimationFrame(checkPlayerMovingForward);


                    function changeMovingImages() {

                        if (screenFrame == 0 || screenFrame % 5 == 0) {


                            $("#Level1 #Player").removeClass("walk" + frame);
                            if (frame == 11) {

                                frame = 0;
                            }
                            frame++;
                            $("#Level1 #Player").addClass("walk" + frame);

                        }
                        screenFrame++;
                        level1ChangePlayerImageId = requestAnimationFrame(changeMovingImages);
                    }
                    level1ChangePlayerImageId = requestAnimationFrame(changeMovingImages);
                    isMoving = 1;
                    break;
                case 1:
                    break;
                case 2:
                    cancelAnimationFrame(level1ChangePlayerImageId);
                    cancelAnimationFrame(level1MovingId)
                    $("#Level1 #Player").removeClass();
                    $(".enemy1").speed(0.3);
                    $(".enemy1").moveTo(270);
                    $("#Level1 #Player").css("background", "url('images/p3_front.png')");
                    $("#Level1 #Player").moveTo(null);
                    $(".scene").moveTo(null);
                    $(".coin").moveTo(null);
                    $(".brick_wall").moveTo(null);
                    isMoving = 0;
                    $("#Level1 #Player").removeClass("flipped");
                    break;
                case 9:
                    if ($("#Level1 #Player").hasClass('flipped')) {
                        $("#Level1 #Player").removeClass('flipped');
                    }
                    resetMoving($("#Level1 #Player"));
                    clearInterval(globalID);
                    globalID = setInterval(function () {
                        //player.toggleClass("player_stand");
                        if (($("#Level1 #Player").position().left + $("#Level1 #Player").width() / 2) >= $(window).width() / 2) {
                            $("#Level1 #Player").moveTo(null);
                            $("#Level1 #Player").css("background", "url('images/p3_jump.png')");
                            $(".scene").speed(0.3);
                            $(".scene").moveTo(270);
                            $(".coin").speed(0.3);
                            $(".coin").moveTo(270);
                            $(".brick_wall").speed(0.3);
                            $(".brick_wall").moveTo(270);
                            isSceneMoving = 1;
                            if ($("#Scene10").position().left <= 0) {
                                $(".scene").moveTo(null);
                                $(".coin").moveTo(null);
                                $(".brick_wall").moveTo(null);
                                isSceneMoving = 0;
                                playerMovingForward($("#Level1 #Player"));
                            }
                        }
                        else {
                            //call player right move function
                            $(".scene").moveTo(null);
                            $(".coin").moveTo(null);
                            $(".brick_wall").moveTo(null);
                            isSceneMoving = 0;
                            playerMovingForward($("#Level1 #Player"));
                        }
                    }, 1000 / 60);
                    isMoving = 1;
                    break;


            }
        }

        function moveLeft() {

            switch (isMoving) {
                case 0:
                    cancelAnimationFrame(level1ChangePlayerImageId);
                    cancelAnimationFrame(level1MovingId);
                    $("#Level1 #Player").removeClass();
                    if (!$('#Level1 #Player').hasClass("flipped")) {

                        $('#Level1 #Player').addClass("flipped")
                    }
                    resetMoving($("#Player"));
                    function checkPlayerMovingForward() {

                        if (($("#Level1 #Player").position().left + $("#Level1 #Player").width() / 2) <= $(window).width() / 2) {
                            $("#Level1 #Player").moveTo(null);

                            $(".scene").speed(0.5);
                            $(".scene").moveTo(90);
                            $(".enemy1").speed(0.3);
                            $(".enemy1").moveTo(90);
                            $(".coin").speed(0.5);
                            $(".coin").moveTo(90);
                            $(".brick_wall").speed(0.5);
                            $(".brick_wall").moveTo(90);
                            isSceneMoving = 1;
                            if ($("#Scene1").position().left >= 0) {

                                $(".enemy1").speed(0.3);
                                $(".enemy1").moveTo(270);
                                $(".scene").moveTo(null);
                                $(".coin").moveTo(null);
                                $(".brick_wall").moveTo(null);
                                isSceneMoving = 0;
                                playerMovingBackward($("#Level1 #Player"));
                            }
                            else {
                                if ($("#Fly1").length > 0) {
                                    $("#Fly1").css("left", $('#Fly1').position().left + 2);
                                }

                            }
                        }
                        else {
                            $(".scene").moveTo(null);
                            $(".coin").moveTo(null);
                            $(".enemy1").speed(0.3);
                            $(".enemy1").moveTo(270);
                            $(".brick_wall").moveTo(null);
                            isSceneMoving = 0;
                            playerMovingBackward($("#Level1 #Player"));
                        }
                        level1MovingId = requestAnimationFrame(checkPlayerMovingForward);
                    }
                    level1MovingId = requestAnimationFrame(checkPlayerMovingForward);

                    function changeMovingImages() {

                        if (screenFrame == 0 || screenFrame % 5 == 0) {


                            $("#Level1 #Player").removeClass("walk" + frame);
                            if (frame == 11) {

                                frame = 0;
                            }
                            frame++;
                            $("#Level1 #Player").addClass("walk" + frame);


                        }
                        screenFrame++
                        level1ChangePlayerImageId = requestAnimationFrame(changeMovingImages);
                    }
                    level1ChangePlayerImageId = requestAnimationFrame(changeMovingImages);
                    isMoving = 2;
                    break;
                case 1:
                    cancelAnimationFrame(level1ChangePlayerImageId);
                    cancelAnimationFrame(level1MovingId);
                    $("#Level1 #Player").removeClass();
                    $(".enemy1").speed(0.3);
                    $(".enemy1").moveTo(270);
                    $("#Level1 #Player").css("background", "url('images/p3_front.png')");
                    $("#Level1 #Player").moveTo(null);
                    $(".scene").moveTo(null);
                    $(".coin").moveTo(null);
                    $(".brick_wall").moveTo(null);
                    isMoving = 0;
                    break;
                case 2:
                    break;
                case 8:
                    resetMoving($("#Level1 #Player"));
                    clearInterval(globalID);
                    globalID = setInterval(function () {
                        if (($("#Level1 #Player").position().left + $("#Level1 #Player").width() / 2) <= $(window).width() / 2) {
                            $("#Level1 #Player").moveTo(null);
                            $("#Level1 #Player").css("background", "url('images/p3_jump.png')");
                            $(".scene").speed(0.3);
                            $(".scene").moveTo(90);
                            $(".coin").speed(0.3);
                            $(".coin").moveTo(90);
                            $(".brick_wall").speed(0.3);
                            $(".brick_wall").moveTo(90);
                            isSceneMoving = 1;
                            if ($("#Scene1").position().left >= 0) {
                                $(".scene").moveTo(null);
                                $(".coin").moveTo(null);
                                $(".brick_wall").moveTo(null);
                                isSceneMoving = 0;
                                playerMovingBackward($("#Level1 #Player"));
                            }
                        }
                        else {
                            //call player right move function
                            $(".scene").moveTo(null);
                            $(".coin").moveTo(null);
                            $(".brick_wall").moveTo(null);
                            isSceneMoving = 0;
                            playerMovingBackward($("#Level1 #Player"));
                        }
                    }, 1000 / 60);
                    isMoving = 2;
                    break;

            }
        }

        function moveUp() {

            switch (isMoving) {
                case 0:
                    cancelAnimationFrame(level1ChangePlayerImageId);
                    cancelAnimationFrame(level1MovingId);
                    cancelAnimationFrame(level1JumpId);
                    $("#Level1 #Player").removeClass();
                    isMoving = 3;
                    resetMoving($("#Level1 #Player"));
                    playerJump($("#Level1 #Player"));
                    break;
                case 1:
                    resetMoving($("#Level1 #Player"));
                    isMoving = 4;

                    if (isSceneMoving == 0) {
                        cancelAnimationFrame(level1ChangePlayerImageId);
                        cancelAnimationFrame(level1MovingId);
                        $("#Level1 #Player").removeClass();
                        playerJumpForward($("#Level1 #Player"));
                    }
                    else {
                        cancelAnimationFrame(level1ChangePlayerImageId);
                        cancelAnimationFrame(level1MovingId);
                        $("#Level1 #Player").removeClass();
                        playerJumpForwardWithScene($("#Level1 #Player"));
                    }

                    break;
                case 2:
                    resetMoving($("#Level1 #Player"));
                    isMoving = 5;
                    if (isSceneMoving == 0) {
                        cancelAnimationFrame(level1ChangePlayerImageId);
                        cancelAnimationFrame(level1MovingId);
                        $("#Level1 #Player").removeClass();
                        playerJumpBackward($("#Level1 #Player"));
                    }
                    else {
                        cancelAnimationFrame(level1ChangePlayerImageId);
                        cancelAnimationFrame(level1MovingId);
                        $("#Level1 #Player").removeClass();
                        playerJumpBackwardWithScene($("#Level1 #Player"));
                    }
                    break;
            }
        }

        //Player jump function
        function playerJump($player) {
            $player.weight(0);
            var playerTop = $player.position().top;
            $player.speed(1);
            $player.moveTo($player.position().left, $player.position().top - 150 * $(window).height() / 768);
            function checkPlayerJump() {
                if ($player.position().top <= playerTop - 150 * $(window).height() / 768) {

                    $player.weight(1);
                    $player.moveTo(180);


                }
                level1JumpId = requestAnimationFrame(checkPlayerJump);
            }
            level1JumpId = requestAnimationFrame(checkPlayerJump);


            //setTimeout(function () {
            //    $player.weight(1);
            //    $player.moveTo(180);
            //    //$player.css("background", "url('images/p3_front.png')");
            //    //OnCollisionWithEnemy($('.enemy1'), $player);
            //    globalID = setInterval(function () {
            //        if ($player.position().top >= playerTop) {

            //            isMoving = 0;
            //            //clearInterval(globalID);
            //        }
            //    }, 1000 / 60);
            //}, 500);


        }

        //Player jump forward

        function playerJumpForward($player) {

            $player.css("background", "url('images/p3_jump.png')");

            var playerTop = $player.position().top;
            $player.speed(1);
            $player.moveTo($player.position().left + 300, $player.position().top - 500);
            $player.weight(0.1);
            setTimeout(function () {
                $player.weight(1);
                $player.moveTo(135);
                function checkPlayerJumpForward() {
                    if ($player.position().top >= playerTop) {

                        isMoving = 0;
                    }
                    level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
                }
                level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
            }, 500);
        }

        //Player jump forward with scene function
        function playerJumpForwardWithScene($player) {

            $player.css("background", "url('images/p3_jump.png')");

            function checkPlayerMovingForward() {

                if ($("#Fly1").length > 0) {
                    $("#Fly1").css("left", ($('#Fly1').position().left - 2) + "px");
                }
                level1MovingId = requestAnimationFrame(checkPlayerMovingForward);
            }
            level1MovingId = requestAnimationFrame(checkPlayerMovingForward);
            var playerTop = $player.position().top;
            $player.speed(1);
            $player.moveTo($player.position().left, $player.position().top - 400);
            $(".scene").speed(0.5);
            $(".scene").moveTo(270);
            $(".enemy1").speed(0.8);
            $(".enemy1").moveTo(270);
            $(".coin").speed(0.5);
            $(".coin").moveTo(270);
            $(".brick_wall").speed(0.5);
            $(".brick_wall").moveTo(270);
            $player.weight(0.2);
            setTimeout(function () {
                $player.weight(1);
                $player.moveTo(180);
                function checkPlayerJumpForward() {
                    if ($player.position().top >= playerTop) {
                        $(".scene").moveTo(null);
                        $(".coin").moveTo(null);
                        $(".brick_wall").moveTo(null);
                        isMoving = 0;
                    }
                    level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
                }
                level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
            }, 500);


        }
        //Player jump backward with scene function
        function playerJumpBackwardWithScene($player) {
            if (!$player.hasClass("flipped")) {
                $player.addClass("flipped");
            }
            $player.css("background", "url('images/p3_jump.png')");
            function checkPlayerMovingForward() {

                if ($("#Fly1").length > 0) {
                    $("#Fly1").css("left", ($('#Fly1').position().left + 2) + "px");
                }
                level1MovingId = requestAnimationFrame(checkPlayerMovingForward);
            }
            level1MovingId = requestAnimationFrame(checkPlayerMovingForward);
            var playerTop = $player.position().top;
            $player.speed(1);
            $player.moveTo($player.position().left, $player.position().top - 500);
            $(".scene").speed(0.5);
            $(".scene").moveTo(90);
            $(".enemy1").speed(0.3);
            $(".enemy1").moveTo(90);
            $(".coin").moveTo(0.5);
            $(".coin").moveTo(90);
            $(".brick_wall").moveTo(0.5);
            $(".brick_wall").moveTo(90);
            $player.weight(0.2);
            setTimeout(function () {
                $player.weight(1);
                $player.moveTo(180);
                function checkPlayerJumpForward() {
                    if ($player.position().top >= playerTop) {
                        $(".scene").moveTo(null);
                        $(".coin").moveTo(null);
                        $(".brick_wall").moveTo(null);
                        isMoving = 0;
                    }
                    level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
                }
                level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
            }, 500);




        }

        //Player jump backward
        function playerJumpBackward($player) {

            if (!$player.hasClass("flipped")) {
                $player.addClass("flipped");
            }

            $player.css("background", "url('images/p3_jump.png')");
            var playerTop = $player.position().top;
            $player.speed(1);
            $player.moveTo($player.position().left - 300, $player.position().top - 500);
            $player.weight(0.2);
            setTimeout(function () {
                $player.weight(1);
                $player.moveTo(225);
                //$player.css("background", "url('images/p3_front.png')");
                //OnCollisionWithEnemy($('.enemy1'), $player);
                function checkPlayerJumpForward() {
                    if ($player.position().top >= playerTop) {

                        isMoving = 0;
                    }
                    level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
                }
                level1JumpId = requestAnimationFrame(checkPlayerJumpForward);
            }, 500);



        }

    });

    //Set level 1 completion button event
    $("#Level1Completion .next_button").on("click", function () {

        $('#Level1Completion').fadeOut();
        setLevel2Screen();
    });
    //Set level 2 completion button event
    $("#Level2Completion .next_button").on("click", function () {

        $('#Level2Completion').fadeOut();
        setLevel3Screen();
    });
    //Set level 3 completion button event
    $("#Level3Completion .next_button").on("click", function () {

        $('#Level3Completion').fadeOut();
        location.reload();
    });

    //Level selection screen level 2 start button
    $(".level_2_start").on("click", function () {
        setLevel2Screen();
    });

    //set level 2 screen
    function setLevel2Screen() {

        var timerID;
        var time = 0;
        var isMoving = 0;
        var screenFrame = 0;
        var frame = 0;
        var currentTime = Date.now();
        var currentTimeId;
        var stopByWall = false;
        var fireRotate;
        var blockerNo = 0;
        var itemDisappear = false;
        var globalId1;

        $("#Level2 #Player").autoRemoveOffScreen(false);
        $("#Level2 #Player").css("top", ($(window).height() - $("#Level2 .ground").height() - $("#Level2 #Player").height()) + "px").css("left", "0px");

        //fade out level selection screen
        $("#LevelSelectionScreen").fadeOut();
        //fade in level 2 screen
        $("#Level2").fadeIn();

        // Stop welcome screen music playing
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        //level 2 screen help button
        $('#Level2 #help_button').on('click', function () {

            //pause all moving object
            pause(true);
            //add grey shade to level 2 main div
            $("#Level2").addClass("paused");
            //fade in help screen
            $("#Level2 #help_information_holder").fadeIn();
        });

        //help screen close button
        $('#Level2 .help_close_icon').on('click', function () {

            //fade out help screen
            $("#Level2 #help_information_holder").fadeOut();
            //remove level 2 div shade
            $("#Level2").removeClass("paused");
            //resume game
            pause(false);
        });

        var coinBoxNo = 1;
        function checkTime() {

            currentTime = Date.now();
            currentTimeId = requestAnimationFrame(checkTime);


            if (blockerNo == 5) {


                $("#Level2").append("<div class='coin_box' id='CoinBox" + coinBoxNo + "' style='display:none;left:" + (Math.floor(Math.random() * $(window).width() - 51)) + "px; top:" + ($(window).height() / 4 - 51) + "px'></div>");
                $("#CoinBox" + coinBoxNo).fadeIn();
                blockerNo++;
                coinBoxNo++;
            }
            if (itemDisappear && coinBoxNo < 6) {

                $("#Level2").append("<div class='coin_box' id='CoinBox" + coinBoxNo + "' style='display:none;left:" + (Math.floor(Math.random() * ($(window).width() - 51))) + "px; top:" + ($(window).height() / 4 - 51) + "px'></div>");
                $("#CoinBox" + coinBoxNo).fadeIn();
                itemDisappear = false;
                coinBoxNo++;
                blockerNo++;
            }
            if (blockerNo >= 10 && blockerNo < 14 && itemDisappear) {
                $("#Level2").append("<div class='warn_box' id='WarnBox" + blockerNo + "' style='display:none;left:" + (Math.floor(Math.random() * ($(window).width() / 2))) + "px; top:" + ($(window).height() / 3 - 51) + "px'></div>");
                $("#WarnBox" + blockerNo).fadeIn();
                $("#WarnBox" + blockerNo).speed(0.5);
                $("#WarnBox" + blockerNo).moveTo(45);
                $("#WarnBox" + blockerNo).weight(0.1);
                itemDisappear = false;
                blockerNo++;

                setTimeout(function () {
                    itemDisappear = true;
                }, 1000);
            }
            if (blockerNo >= 14 && blockerNo < 16 && itemDisappear) {
                $("#Level2").append("<div class='warn_box' id='WarnBox" + blockerNo + "' style='display:none;left:" + (Math.floor(Math.random() * ($(window).width() / 2))) + "px; top:" + ($(window).height() / 4 - 51) + "px'></div>");
                $("#WarnBox" + blockerNo).fadeIn();
                $("#WarnBox" + blockerNo).speed(0.5);
                $("#WarnBox" + blockerNo).moveTo(45);
                $("#WarnBox" + blockerNo).weight(0.1);
                itemDisappear = false;
                blockerNo++;

                setTimeout(function () {
                    itemDisappear = true;
                }, 1000);

                setTimeout(function () {
                    $('#Level2').remove();
                    $('#WelcomeScreen').fadeIn();
                    $('.license').remove();
                    $('.button_start').remove();

                    //display level 1 complete screen
                    $('#Level2Completion').fadeIn();
                    $(".level_2_score_display").html(score);
                }, 10000);
            }
        }
        currentTimeId = requestAnimationFrame(checkTime);

        //Scale leaderboard
        var scale = $(window).height() / 768;

        //scale Leaderborad
        $("#Level2 #Leaderboard").css("transform", "scale(" + scale + ")").css("top", $(window).height() * 0.01 * scale + "px");

        $("#Level2").append("<div class='blocker' id='Blocker1' style='left: 1px; top:" + ($(window).height() / 4 - 51) + "px'></div>");
        $("#Blocker1").speed(0.3);
        $("#Blocker1").moveTo(90);
        $("#Blocker1").autoBounceOff(true);


        //Generate enemy fly
        $("#Level2 .scene_holder").append("<div class='fly' id='Enemy" + time + "' style='top: 0px;left: " + ($(window).width() - 100) + "px;'></div>");
        $("#Enemy" + time).speed(0.2);
        $("#Enemy" + time).moveTo(225);


        $("#Level2 .ground").css('top', ($(window).height() - $("#Level2 .ground").height()) + "px");
        $("#Level2 #RightButton").onTap(function () {
            level2MoveRight();
        });

        $("#Level2 #LeftButton").onTap(function () {

            level2MoveLeft();
        });

        $("#Level2 #JumpButton").onTap(function () {

            level2FireEnemy();
        });

        $("body").keydown(function (e) {
            if (e.keyCode == 39) { // right 
                level2MoveRight();
            }
            else if (e.keyCode == 37) {

                level2MoveLeft();
            }
            else if (e.keyCode == 32) {

                level2FireEnemy();
            }

        });

        $("#Level2 #Player").onCollision(function (otherObject) {

            if (otherObject.hasClass("fly")) {
                otherObject.fadeOut();
                $("#Level2 #Player").css("opacity", "0.7");
                setTimeout(function () {
                    $("#Level2 #Player").css("opacity", "1");

                }, 500);
                life--;
                checkLevel2Life();
                $("#Level2 #Life .text").html(life);
            }
            if (otherObject.hasClass("wall_left")) {
                isMoving = 2;
                cancelAnimationFrame(globalId1);
                $("#Level2 #Player").moveTo(null);
                stopByWall = true;
            }
            else if (otherObject.hasClass("wall_right")) {
                isMoving = 1;
                cancelAnimationFrame(globalId1);
                $("#Level2 #Player").moveTo(null);
                stopByWall = true;
            }

        });

        function level2MoveRight() {

            switch (isMoving) {

                case 0:
                    if ($('#Level2 #Player').hasClass("flipped")) {
                        $('#Level2 #Player').removeClass("flipped")
                    }
                    $('#Level2 #Player').speed(0.5);
                    $('#Level2 #Player').moveTo(90);
                    function repeatOften() {

                        if (screenFrame == 0 || screenFrame % 5 == 0) {


                            $("#Level2 #Player").removeClass("walk" + frame);
                            if (frame == 11) {

                                frame = 0;
                            }
                            frame++;
                            $("#Level2 #Player").addClass("walk" + frame);


                        }
                        screenFrame++
                        globalId1 = requestAnimationFrame(repeatOften);
                    }
                    globalId1 = requestAnimationFrame(repeatOften);
                    isMoving = 1;
                    break;
                case 1:

                    break;
                case 2:
                    if (stopByWall) {
                        cancelAnimationFrame(globalId1);
                        if ($('#Level2 #Player').hasClass("flipped")) {
                            $('#Level2 #Player').removeClass("flipped")
                        }
                        $('#Level2 #Player').speed(0.5);
                        $('#Level2 #Player').moveTo(90);
                        function repeatOften() {

                            if (screenFrame == 0 || screenFrame % 5 == 0) {


                                $("#Level2 #Player").removeClass("walk" + frame);
                                if (frame == 11) {

                                    frame = 0;
                                }
                                frame++;
                                $("#Level2 #Player").addClass("walk" + frame);


                            }
                            screenFrame++
                            globalId1 = requestAnimationFrame(repeatOften);
                        }
                        globalId1 = requestAnimationFrame(repeatOften);
                        isMoving = 1;
                        stopByWall = false;
                    }
                    else {

                        cancelAnimationFrame(globalId1);
                        $("#Level2 #Player").moveTo(null);
                        isMoving = 0;
                    }
                    break;
            }
        }
        //level 2 move left function
        function level2MoveLeft() {

            switch (isMoving) {

                case 0:
                    if (!$('#Level2 #Player').hasClass("flipped")) {

                        $('#Level2 #Player').addClass("flipped")
                    }
                    $("#Level2 #Player").speed(0.5);
                    $("#Level2 #Player").moveTo(270);
                    function repeatOften() {

                        if (screenFrame == 0 || screenFrame % 5 == 0) {


                            $("#Level2 #Player").removeClass("walk" + frame);
                            if (frame == 11) {

                                frame = 0;
                            }
                            frame++;
                            $("#Level2 #Player").addClass("walk" + frame);
                        }
                        screenFrame++
                        globalId1 = requestAnimationFrame(repeatOften);
                    }
                    globalId1 = requestAnimationFrame(repeatOften);
                    isMoving = 2;
                    break;
                case 1:
                    if (stopByWall) {
                        if (!$('#Level2 #Player').hasClass("flipped")) {

                            $('#Level2 #Player').addClass("flipped")
                        }
                        $("#Level2 #Player").speed(0.5);
                        $("#Level2 #Player").moveTo(270);
                        function repeatOften() {

                            if (screenFrame == 0 || screenFrame % 5 == 0) {


                                $("#Level2 #Player").removeClass("walk" + frame);
                                if (frame == 11) {

                                    frame = 0;
                                }
                                frame++;
                                $("#Level2 #Player").addClass("walk" + frame);

                            }
                            screenFrame++
                            globalId1 = requestAnimationFrame(repeatOften);
                        }
                        globalId1 = requestAnimationFrame(repeatOften);
                        isMoving = 2;
                        stopByWall = false;
                    }
                    else {

                        cancelAnimationFrame(globalId1);
                        $("#Level2 #Player").moveTo(null);
                        isMoving = 0;
                    }
                    break;
                case 2:
                    break;
            }
        }

        var i = 0;
        function level2FireEnemy() {

            $("#Level2").append("<div id='Fireball'" + i + " class='fireball' style='top: " + ($(window).height() - ($("#Level2 .ground").height() + $("#Level2 #Player").height())) + "px; left: " + ($("#Level2 #Player").position().left + $("#Level2 #Player").width() / 2 - 11) + "px'></div>");
            $(".fireball").speed(0.7);
            $(".fireball").moveTo(0);
            i++;


            $(".fireball").onCollision(function (otherObject) {

                if (otherObject.hasClass("blocker")) {
                    score += 100;
                    blockerNo++;
                    $("#Level2 #Score").html("Score: " + score);
                    this.remove();
                    otherObject.remove();
                    if (blockerNo != 5) {
                        $("#Level2").append("<div class='blocker' id='Blocker" + blockerNo + "' style='display:none;left:" + (Math.floor(Math.random() * $(window).width() - 51)) + "px; top:" + ($(window).height() / 4 - 51) + "px'></div>");
                        $("#Blocker" + blockerNo).fadeIn();
                        $("#Blocker" + blockerNo).speed(0.5);
                        $("#Blocker" + blockerNo).moveTo(90);
                        $("#Blocker" + blockerNo).autoBounceOff(true);
                    }
                }

                if (otherObject.hasClass("fly")) {
                    score += 100;
                    $("#Level2 #Score").html("Score: " + score);
                    this.remove();
                    otherObject.remove();
                }

                if (otherObject.hasClass("coin_box")) {
                    score += 1000;
                    $("#Level2 #Score").html("Score: " + score);
                    this.remove();
                    otherObject.css('background', 'url(images/coin.png)').css('width', '30px').css('height', '30px').css('z-index', '11').css('background-size', 'cover');
                    otherObject.speed(0.3);
                    otherObject.moveTo(0);
                    setTimeout(function () {
                        otherObject.fadeOut();
                        itemDisappear = true;
                    }, 500);
                }
                if (otherObject.hasClass("warn_box")) {
                    score += 2000;
                    $("#Level2 #Score").html("Score: " + score);
                    this.remove();
                    otherObject.css('background', 'url(images/bomb.png)').css('width', '30px').css('height', '30px').css('z-index', '10').css('background-size', 'cover').addClass("bomb");
                    otherObject.speed(0.3);
                    otherObject.moveTo(315);
                    otherObject.weight(0.1);

                    $("#Level2 #Player").onCollision(function (otherObject) {

                        if (otherObject.hasClass("bomb")) {
                            life--;
                            $("#Life .text").html(life);
                            checkLevel2Life();
                            otherObject.fadeOut();
                            itemDisappear = true;
                        }
                    });
                }
            });
        }
    }
    //check level 2 player health
    function checkLevel2Life() {
        if (life <= 0) {

            $("#GameOverScreen").fadeIn();
            $('#Level2').remove();
            $('#WelcomeScreen').fadeIn();
            $('.license').remove();
            $('.button_start').remove();
            $(".score_display").text(score);
        }
    }
    //check if level 1 is completed
    level1Completed = setInterval(function () {

        if ($("#Level1 #Player").position().left >= $(window).width()) {
            clearInterval(level1Completed);
            $('#Level1').remove();
            $('#WelcomeScreen').fadeIn();
            $('.license').remove();
            $('.button_start').remove();

            //display level 1 complete screen
            $('#Level1Completion').fadeIn();
            $(".level_1_score_display").html(score);
        }

    });

    //set level 1 screen
    function generateLevel1Screen() {

        for (var i = 0; i < 10; i++) {
            //generate level 1 background DIVs
            $("#Level1 .scene_holder").append("<div class='scene_holder_inner' id='SceneHolderInner" + (i + 1) + "'><div class='scene' id='Scene" + (i + 1) + "' style='left:" + $(window).width() * i + "px'></div></div>")
            //generate level 1 ground DIVs
            $("#Level1 .scene_holder #Scene" + (i + 1)).append("<div class='ground' id='Ground" + (i + 1) + "' style='left:0px;top:" + ($(window).height() - $('.ground').height()) + "px'></div>");
            //generate level 1 cloud DIVs
            for (var j = 0; j < 8; j++) {
                $("#Level1 .scene_holder #Scene" + (i + 1)).append("<div class='cloud" + Math.floor((Math.random() * 4) + 1) + "'>");
            }

            //generate level brick wall on the ground

            $("#Level1 .scene_holder #SceneHolderInner" + (i + 1)).append("<div class='brick_wall' id='BrickWall" + (i + 1) + "' style='left:" + ($(window).width() * i + $(window).width() / 4 + Math.floor((Math.random() * ($(window).width() / 4)) + 1)) + "px'></div>");
            if ($(window).height() >= 768) {
                $("#Level1 .scene_holder #SceneHolderInner" + (i + 1) + " #BrickWall" + (i + 1)).css("top", ($(window).height() * 2 / 3) + "px");
            }
            else {
                $("#Level1 .scene_holder #SceneHolderInner" + (i + 1) + " #BrickWall" + (i + 1)).css("top", ($(window).height() / 3) + "px");
            }
            if (i == 0) {

                //generate flying enemy
                $("#Level1").append("<div class='fly_border_top'></div><div class='fly' id='Fly" + (i + 1) + "' style='left:" + ($(window).width() * i + $(window).width() / 4) + "px'></div><div class='fly_border_bottom'></div>");
                $("#Level1 #Fly" + (i + 1)).css("top", ($(window).height() / 2) + "px");

            }

        }
        //generate level 1 enemy1
        for (var k = 0; k < 10 ; k++) {
            $("#Level1").append("<div class='enemy1' id='Snail" + (k + 1) + "' style='left:" + ($(window).width() * k + $(window).width() / 2 + Math.floor((Math.random() * 30) + 1)) + "px'></div>");
        }
        //Scale leaderboard
        var scale = $(window).height() / 768;
        $("#Leaderboard").css("transform", "scale(" + scale + ")").css("top", $(window).height() * 0.01 * scale + "px");



    }
    //set level 3 start button event
    $(".level_3_start").on("click", function () {

        setLevel3Screen();

    });
    //set level 3 screen
    function setLevel3Screen() {

        var screenFrame = 0;
        var frame = 0;
        var isMoving = 0;
        $("#Level3 #Player").autoRemoveOffScreen(false);

        //fade out level selection screen
        $("#LevelSelectionScreen").fadeOut();
        //fade in level 2 screen
        $("#Level3").fadeIn();

        // Stop welcome screen music playing
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        //level 2 screen help button
        $('#Level3 #help_button').on('click', function () {

            //pause all moving object
            pause(true);
            //add grey shade to level 2 main div
            $("#Level3").addClass("paused");
            //fade in help screen
            $("#Level3 #help_information_holder").fadeIn();
        });

        //help screen close button
        $('#Level3 .help_close_icon').on('click', function () {

            //fade out help screen
            $("#Level3 #help_information_holder").fadeOut();
            //remove level 2 div shade
            $("#Level3").removeClass("paused");
            //resume game
            pause(false);
        });
        $("#Level3 .ground").css('top', ($(window).height() - $("#Level3 .ground").height()) + "px");

        var scale = 320 / $(window).height();
        var rows = Math.floor(($(window).height() - 200) / 36);
        //generate level 3 screen
        generateLevel3Screen();
        function generateLevel3Screen() {
            var stopByLeftWall = false;
            var stopByRightWall = false;
            var stopByGroundWall = true;
            var stopByTopWall = false;
            var i = 0;
            //generate level 3 background DIVs
            $("#Level3 .scene_holder").append("<div class='scene_holder_inner' id='SceneHolderInner" + (i + 1) + "'><div class='scene' id='Scene" + (i + 1) + "' style='left:" + $(window).width() * i + "px'></div></div>")
            //generate level 3 ground DIVs
            $("#Level3 .scene_holder #Scene" + (i + 1)).append("<div class='ground' id='Ground" + (i + 1) + "' style='left:0px;top:" + ($(window).height() - $('.ground').height()) + "px'></div>");

            //set background direction sign
            $("#Level3 .scene_holder #Scene" + (i + 1)).append("<div class='sign_right' id='SignRight" + (i + 1) + "' style='left:0px;top:" + ($(window).height() - $('.ground').height() - 70) + "px'></div>");

            $("#Level3 #Player").css('top', ($(window).height() - $("#Level3 .ground").height() - 36) + "px");

            if (rows > 5) {

                $("#Level3 .button").css('top', $(window).height() / 4 + "px").css('left', ($(window).width() / 2 - 70) + "px");
            }

            else {

                $("#Level3 .button").css('top', $(window).height() / 6 + "px").css('left', ($(window).width() / 2 - 70) + "px");
            }
            function setFly() {

                //set enemy1(fly)
                var maxFly = Math.floor($(window).width() / 72);
                for (i = 0; i < maxFly / 4; i++) {
                    $("#Level3 .scene_holder #Scene1").append("<div class='fly fly" + (i + 1) + "' id='Fly" + (i + 1) + "' style='left:" + ($(window).width() + 72 * i) + "px;top:" + ($(window).height() - $("#Level3 .ground").height() - 36 * 2 - 3) + "px'></div>");

                }
                $("#Level3 .fly").autoRemoveOffScreen(false);
                $("#Level3 .fly").speed(0.3);
                $("#Level3 .fly").moveTo(270);
                $("#Level3 .fly").onCollision(function (otherObject) {

                    if (otherObject.hasClass("wall_left")) {
                        if (this.hasClass("fly" + (Math.floor(maxFly / 4)) + "")) {


                            this.remove();
                            setFly();
                        }
                        else {
                            this.autoRemoveOffScreen(true);
                        }
                    }

                });
            }

            setFly();

            function setBox() {

                //set Box objects
                var maxBox = Math.floor($(window).width() / 36);
                for (i = 0; i < maxBox / 4; i++) {
                    $("#Level3 .scene_holder #Scene1").append("<div class='box box" + (i + 1) + "' id='Box" + (i + 1) + "' style='left:" + (-(36 * i)) + "px;top:" + ($(window).height() - $("#Level3 .ground").height() - 36 * 3 - 3) + "px'></div>");

                }
                $("#Level3 .box").autoRemoveOffScreen(false);
                $("#Level3 .box").speed(0.3);
                $("#Level3 .box").moveTo(90);
                $("#Level3 .box").onCollision(function (otherObject) {

                    if (otherObject.hasClass("wall_right")) {
                        if (this.hasClass("box" + (1) + "")) {


                            this.remove();
                            setBox();
                        }
                        else {
                            this.autoRemoveOffScreen(true);
                        }
                    }

                });
            }

            setBox();

            function setFish() {

                //set Fish objects
                var maxFish = Math.floor($(window).width() / 56);
                for (i = 0; i < maxFish / 4; i++) {
                    $("#Level3 .scene_holder #Scene1").append("<div class='fish fish" + (i + 1) + "' id='Fish" + (i + 1) + "' style='left:" + ($(window).width() + 56 * i) + "px;top:" + ($(window).height() - $("#Level3 .ground").height() - 36 * 4 - 3) + "px'></div>");

                }
                $("#Level3 .fish").autoRemoveOffScreen(false);
                $("#Level3 .fish").speed(0.5);
                $("#Level3 .fish").moveTo(270);
                $("#Level3 .fish").onCollision(function (otherObject) {

                    if (otherObject.hasClass("wall_left")) {
                        if (this.hasClass("fish" + (1) + "")) {


                            this.remove();
                            setFish();
                        }
                        else {
                            this.autoRemoveOffScreen(true);
                        }
                    }

                });
            }
            setFish();

            function setBlocker() {

                //set Blocker objects
                var maxBlocker = Math.floor($(window).width() / 36);
                for (i = 0; i < maxBlocker / 2; i++) {
                    $("#Level3 .scene_holder #Scene1").append("<div class='blocker blocker" + (i + 1) + "' id='Blocker" + (i + 1) + "' style='left:" + (-(36 * i)) + "px;top:" + ($(window).height() - $("#Level3 .ground").height() - 36 * 5 - 3) + "px'></div>");

                }
                $("#Level3 .blocker").autoRemoveOffScreen(false);
                $("#Level3 .blocker").speed(0.2);
                $("#Level3 .blocker").moveTo(90);
                $("#Level3 .blocker").onCollision(function (otherObject) {

                    if (otherObject.hasClass("wall_right")) {
                        if (this.hasClass("blocker" + (1) + "")) {


                            this.remove();
                            setBlocker();
                        }
                        else {
                            this.autoRemoveOffScreen(true);
                        }
                    }

                });
            }
            setBlocker();

            if (rows > 4) {
                function setBullet() {

                    //set Bullet objects
                    var maxBullet = Math.floor($(window).width() / 36);
                    for (i = 0; i < maxBullet / 4; i++) {
                        $("#Level3 .scene_holder #Scene1").append("<div class='bullet bullet" + (i + 1) + "' id='Bullet" + (i + 1) + "' style='left:" + ($(window).width() + 70 * i * i) + "px;top:" + ($(window).height() - $("#Level3 .ground").height() - 36 * 7 - 3) + "px'></div>");

                    }
                    $("#Level3 .bullet").autoRemoveOffScreen(false);
                    $("#Level3 .bullet").speed(0.6);
                    $("#Level3 .bullet").moveTo(270);
                    $("#Level3 .bullet").onCollision(function (otherObject) {

                        if (otherObject.hasClass("wall_left")) {
                            if (this.hasClass("bullet" + (1) + "")) {


                                this.remove();
                                setBullet();
                            }
                            else {
                                this.autoRemoveOffScreen(true);
                            }
                        }

                    });
                }
                setBullet();
            }

            if (rows > 5) {
                function setBoxAlt() {

                    //set Blocker objects
                    var maxBoxAlt = Math.floor($(window).width() / 36);
                    for (i = 0; i < maxBoxAlt / 6; i++) {
                        $("#Level3 .scene_holder #Scene1").append("<div class='box_alt box_alt" + (i + 1) + "' id='BoxAlt" + (i + 1) + "' style='left:" + (-(36 * i * i)) + "px;top:" + ($(window).height() - $("#Level3 .ground").height() - 36 * 9 - 3) + "px'></div>");

                    }
                    $("#Level3 .box_alt").autoRemoveOffScreen(false);
                    $("#Level3 .box_alt").speed(0.2);
                    $("#Level3 .box_alt").moveTo(90);
                    $("#Level3 .box_alt").onCollision(function (otherObject) {

                        if (otherObject.hasClass("wall_right")) {
                            if (this.hasClass("box_alt" + (1) + "")) {


                                this.remove();
                                setBoxAlt();
                            }
                            else {
                                this.autoRemoveOffScreen(true);
                            }
                        }

                    });
                }
                setBoxAlt();
            }

            $(".scene").autoRemoveOffScreen(false);

            $("#Level3 #Player").autoRemoveOffScreen(false);

            //set Level 3 on collision event
            $("#Level3 #Player").onCollision(function (otherObject) {

                if (otherObject.hasClass("ground")) {

                    //clearInterval(globalID);
                    $("#Level3 #Player").removeClass();
                    $("#Level3 #Player").weight(0);
                    $("#Level3 #Player").moveTo(null);
                    $(".scene").moveTo(null);
                    $(".coin").moveTo(null);
                    $(".brick_wall").moveTo(null);
                    $(".enemy1").speed(0.3);
                    $(".enemy1").moveTo(270);
                    $("#Level3 #Player").css("background", "url('images/p3_front.png')");
                    $("#Level3 #Player").speed(100);
                    $("#Level3 #Player").moveTo($("#Level3 #Player").position().left, otherObject.position().top - $("#Level3 #Player").height());

                }

                if (otherObject.hasClass("wall_left")) {
                    $("#Level3 #Player").moveTo(null);
                    stopByLeftWall = true;
                }
                else if (otherObject.hasClass("wall_right")) {
                    $("#Level3 #Player").moveTo(null);
                    stopByRightWall = true;
                }
                else if (otherObject.hasClass("wall_top")) {
                    $("#Level3 #Player").moveTo(null);
                    stopByTopWall = true;
                }
                else if (otherObject.hasClass("button")) {
                    $("#Level3 .button").animate({
                        opacity: "0.5",
                    }, 500, function () {
                        // Animation complete.
                        $("#Level3 #Player").moveTo(null);
                        $('#Level3').remove();
                        $('#WelcomeScreen').fadeIn();
                        $('.license').remove();
                        $('.button_start').remove();

                        //display level 3 complete screen
                        $('#Level3Completion').fadeIn();
                        $(".level_3_score_display").html(score);
                    });

                }
                else if (otherObject.hasClass("ground")) {
                    $("#Level3 #Player").moveTo(null);
                    stopByGroundWall = true;
                }
                else if (otherObject.hasClass("fly")) {

                    $("#Level3 #Player").moveTo(null);
                    this.css('z-index', '200');
                    this.fadeOut();
                    $("#Level3 #player").moveTo(null);
                    checkLevel3Life();

                }
                else if (otherObject.hasClass("box")) {

                    $("#Level3 #Player").moveTo(null);
                    this.css('z-index', '200');
                    this.fadeOut();
                    $("#Level3 #player").moveTo(null);
                    checkLevel3Life();

                }
                else if (otherObject.hasClass("fish")) {

                    $("#Level3 #Player").moveTo(null);
                    this.css('z-index', '200');
                    this.fadeOut();
                    $("#Level3 #player").moveTo(null);
                    checkLevel3Life();

                }
                else if (otherObject.hasClass("blocker")) {

                    $("#Level3 #Player").moveTo(null);
                    this.css('z-index', '200');
                    this.fadeOut();
                    $("#Level3 #player").moveTo(null);
                    checkLevel3Life();

                }
                else if (otherObject.hasClass("box_alt")) {

                    $("#Level3 #Player").moveTo(null);
                    this.css('z-index', '200');
                    this.fadeOut();
                    $("#Level3 #player").moveTo(null);
                    checkLevel3Life();

                }
                else if (otherObject.hasClass("bullet")) {

                    $("#Level3 #Player").moveTo(null);
                    this.css('z-index', '200');
                    this.fadeOut();
                    $("#Level3 #player").moveTo(null);
                    checkLevel3Life();

                }
            });

            function checkLevel3Life() {

                life--;
                $("#Level3 #Leaderboard #Life .text").text(life);

                if (life <= 0) {

                    $("#GameOverScreen").fadeIn();
                    $('#Level3').remove();
                    $('#WelcomeScreen').fadeIn();
                    $('.license').remove();
                    $('.button_start').remove();
                    $(".score_display").text(score);
                }
                else {
                    $("#Level3 #Player").moveTo(null);
                    $("#Level3 #Player").css('top', ($(window).height() - 70 - 36) + "px");
                    $("#Level3 #Player").css('z-index', '10');
                    $("#Level3 #Player").fadeIn();
                }
            }

            $("body #RightButton").onTap(function () {

                moveRight();
            });

            $("body #LeftButton").onTap(function () {

                moveLeft();
            });

            $("body #JumpButton").onTap(function () {

                moveUp();
            });
            $("body #DownButton").onTap(function () {

                moveDown();
            });

            $("body").keydown(function (e) {
                if (e.keyCode == 39) { // right 
                    moveRight();
                }
                else if (e.keyCode == 37) {
                    moveLeft();
                }
                else if (e.keyCode == 38) {

                    moveUp();
                }
                else if (e.keyCode == 40) {

                    moveDown();
                }

            });

            //level 3 moving forward function
            function moveRight() {

                switch (isMoving) {
                    case 0:

                        stopByLeftWall = false;
                        if (!stopByRightWall) {
                            resetMoving($("#Level3 #Player"));
                            if ($("#Level3 #Player").hasClass('flipped')) {
                                $("#Level3 #Player").removeClass('flipped');
                            }
                            $(".scene").moveTo(null);
                            $("#Level3 #Player").speed(1);
                            $("#Level3 #Player").moveTo($("#Level3 #Player").position().left + $("#Level3 #Player").width() / 2, $("#Level3 #Player").position().top);
                            isMoving = 0;
                        }
                        break;
                }
            }

            function moveLeft() {

                switch (isMoving) {
                    case 0:
                        stopByRightWall = false;
                        if (!stopByLeftWall) {

                            resetMoving($("#Level3 #Player"));
                            if ($("#Level3 #Player").hasClass('flipped')) {
                                $("#Level3 #Player").removeClass('flipped');
                            }
                            $(".scene").moveTo(null);
                            $("#Level3 #Player").speed(1);
                            $("#Level3 #Player").moveTo($("#Level3 #Player").position().left - $("#Level3 #Player").width() / 2, $("#Level3 #Player").position().top);
                            isMoving = 0;
                        }
                        break;
                }
            }

            function moveUp() {

                switch (isMoving) {
                    case 0:
                        score += 1000;
                        $("#Level3 #Score").text(score);
                        stopByGroundWall = false;
                        if (!stopByTopWall) {
                            isMoving = 0;
                            resetMoving($("#Level3 #Player"));
                            playerMoveUp($("#Level3 #Player"));
                        }

                        break;

                }
            }
            function moveDown() {

                switch (isMoving) {
                    case 0:
                        stopByTopWall = false;
                        if (!stopByGroundWall) {
                            isMoving = 0;
                            resetMoving($("#Level3 #Player"));
                            playerMoveDown($("#Level3 #Player"));
                        }

                        break;

                }
            }

            //Player move up function
            function playerMoveUp($player) {
                $player.weight(0);
                var playerTop = $player.position().top;
                $player.speed(1);
                $player.moveTo($player.position().left, ($player.position().top - $player.height()));
            }
            //Player move bottom function
            function playerMoveDown($player) {
                $player.weight(0);
                var playerTop = $player.position().top;
                $player.speed(1);
                $player.moveTo($player.position().left, ($player.position().top + $player.height()));
            }


        }
    }
});

//Player moving right function 
function playerMovingForward($player) {
    $player.speed(0.5);
    $player.moveTo(90);
}
//Player stop moving right
function playerStopForward($player) {
    $player.css("background", "url('images/p3_front.png')");
    $player.moveTo(null);
    $player.speed(0.1);
    $player.moveTo($player.position().left + 20, $player.position().top);
}

//Player moving left function
function playerMovingBackward($player) {
    $player.speed(0.5);
    $player.moveTo(270);
}

//Player stop moving left
function playerStopBackward($player) {
    $player.css("background", "url('images/p3_front.png')");
    $player.removeClass("flipped");
    $player.moveTo(null);
    $player.speed(0.1);
    $player.moveTo($player.position().left - 20, $player.position().top);
}
//On Collision function
function OnCollision($object1, $object2) {
    $object1.onCollision(function ($object2) {
        $object1.moveTo(null);
    });

}
function EnemiesMovingBetweenObjects($enemy, $direction, $object1, $object2) {

    $enemy.speed(0.2);
    $enemy.moveTo($direction);
    $enemy.autoBounceOff(true);
    $enemy.onCollision(function ($object1) {

        $enemy.toggleClass("flipped");

    });
    $enemy.onCollision(function ($object2) {
        $enemy.toggleClass("flipped");
    });
}
function OnCollisionWithEnemy($enemy, $player) {


    $enemy.onCollision(function ($player) {


        $enemy.remove();
        score += 100;
        $("#Score").html("Score: " + score);
    });


}
function OnCollisionWithCoins($player, $coin) {

    $player.onCollision(function ($coin) {


        $coin.remove();
        score += 100;
        $("#Score").html("Score: " + score);
    });


}

// reset player from current move
function resetMoving($player) {

    $player.moveTo(null);
    $(".scene").moveTo(null);
    $(".coin").moveTo(null);
    $(".stand1").moveTo(null);
}
//set level 1 coin objects
function resetLevel1Coins() {

    $("#SceneHolder1 .coin_holder").append("<div class='coin' id='Coin1' style='left:" + $(window).width() / 2 + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 40) + "px;" + "'></div>");
    $("#SceneHolder1 .coin_holder").append("<div class='coin' id='Coin2' style='left:" + ($(window).width() / 2 + 50) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 40) + "px;" + "'></div>");
    $("#SceneHolder1 .coin_holder").append("<div class='coin' id='Coin3' style='left:" + ($(window).width() / 2 + 80) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 40) + "px;" + "'></div>");
    $("#SceneHolder1 .coin_holder").append("<div class='coin' id='Coin4' style='left:" + ($(window).width() / 2 + 120) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 70) + "px;" + "'></div>");
    $("#SceneHolder1 .coin_holder").append("<div class='coin' id='Coin5' style='left:" + ($(window).width() / 2 + 160) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 70) + "px;" + "'></div>");
    $("#SceneHolder1 .coin_holder").append("<div class='coin' id='Coin6' style='left:" + ($(window).width() / 2 + 190) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 70) + "px;" + "'></div>");
    $("#SceneHolder2 .coin_holder").append("<div class='coin' id='Coin7' style='left:" + ($(window).width() / 2 + $(window).width() * 1) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder2 .coin_holder").append("<div class='coin' id='Coin8' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 1) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder2 .coin_holder").append("<div class='coin' id='Coin9' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 1) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder2 .coin_holder").append("<div class='coin' id='Coin10' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 1) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder2 .coin_holder").append("<div class='coin' id='Coin11' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 1) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder2 .coin_holder").append("<div class='coin' id='Coin12' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 1) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder3 .coin_holder").append("<div class='coin' id='Coin13' style='left:" + ($(window).width() / 2 + $(window).width() * 2) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder3 .coin_holder").append("<div class='coin' id='Coin14' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 2) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder3 .coin_holder").append("<div class='coin' id='Coin15' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 2) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder3 .coin_holder").append("<div class='coin' id='Coin16' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 2) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder3 .coin_holder").append("<div class='coin' id='Coin17' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 2) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder3 .coin_holder").append("<div class='coin' id='Coin18' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 2) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder4 .coin_holder").append("<div class='coin' id='Coin19' style='left:" + ($(window).width() / 2 + $(window).width() * 3) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder4 .coin_holder").append("<div class='coin' id='Coin20' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 3) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder4 .coin_holder").append("<div class='coin' id='Coin21' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 3) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder4 .coin_holder").append("<div class='coin' id='Coin22' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 3) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder4 .coin_holder").append("<div class='coin' id='Coin23' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 3) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder4 .coin_holder").append("<div class='coin' id='Coin24' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 3) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder5 .coin_holder").append("<div class='coin' id='Coin25' style='left:" + ($(window).width() / 2 + $(window).width() * 4) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder5 .coin_holder").append("<div class='coin' id='Coin26' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 4) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder5 .coin_holder").append("<div class='coin' id='Coin27' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 4) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder5 .coin_holder").append("<div class='coin' id='Coin28' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 4) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder5 .coin_holder").append("<div class='coin' id='Coin29' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 4) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder5 .coin_holder").append("<div class='coin' id='Coin30' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 4) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder6 .coin_holder").append("<div class='coin' id='Coin31' style='left:" + ($(window).width() / 2 + $(window).width() * 5) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder6 .coin_holder").append("<div class='coin' id='Coin32' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 5) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder6 .coin_holder").append("<div class='coin' id='Coin33' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 5) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder6 .coin_holder").append("<div class='coin' id='Coin34' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 5) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder6 .coin_holder").append("<div class='coin' id='Coin35' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 5) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder6 .coin_holder").append("<div class='coin' id='Coin36' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 5) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder7 .coin_holder").append("<div class='coin' id='Coin37' style='left:" + ($(window).width() / 2 + $(window).width() * 6) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder7 .coin_holder").append("<div class='coin' id='Coin38' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 6) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder7 .coin_holder").append("<div class='coin' id='Coin39' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 6) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder7 .coin_holder").append("<div class='coin' id='Coin40' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 6) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder7 .coin_holder").append("<div class='coin' id='Coin41' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 6) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder7 .coin_holder").append("<div class='coin' id='Coin42' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 6) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder8 .coin_holder").append("<div class='coin' id='Coin43' style='left:" + ($(window).width() / 2 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder8 .coin_holder").append("<div class='coin' id='Coin44' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder8 .coin_holder").append("<div class='coin' id='Coin45' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder8 .coin_holder").append("<div class='coin' id='Coin46' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder8 .coin_holder").append("<div class='coin' id='Coin47' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder8 .coin_holder").append("<div class='coin' id='Coin48' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder9 .coin_holder").append("<div class='coin' id='Coin49' style='left:" + ($(window).width() / 2 + $(window).width() * 8) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder9 .coin_holder").append("<div class='coin' id='Coin50' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 8) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder9 .coin_holder").append("<div class='coin' id='Coin51' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 8) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder9 .coin_holder").append("<div class='coin' id='Coin52' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 8) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder9 .coin_holder").append("<div class='coin' id='Coin53' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 8) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder9 .coin_holder").append("<div class='coin' id='Coin54' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 8) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder10 .coin_holder").append("<div class='coin' id='Coin55' style='left:" + ($(window).width() / 2 + $(window).width() * 7) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder10 .coin_holder").append("<div class='coin' id='Coin56' style='left:" + ($(window).width() / 2 + 50 + $(window).width() * 9) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder10 .coin_holder").append("<div class='coin' id='Coin57' style='left:" + ($(window).width() / 2 + 80 + $(window).width() * 9) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 20) + "px;" + "'></div>");
    $("#SceneHolder10 .coin_holder").append("<div class='coin' id='Coin58' style='left:" + ($(window).width() / 2 + 120 + $(window).width() * 9) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder10 .coin_holder").append("<div class='coin' id='Coin59' style='left:" + ($(window).width() / 2 + 160 + $(window).width() * 9) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");
    $("#SceneHolder10 .coin_holder").append("<div class='coin' id='Coin60' style='left:" + ($(window).width() / 2 + 190 + $(window).width() * 9) + "px;" + "top:" + ($(window).height() - groundHeight - playerHeight - playerJumpHeight - 50) + "px;" + "'></div>");

}
//Reset enemies
function resetEnemy() {


    for (i = 1; i <= 10 ; i++) {
        $("#Enemy" + i).css('left', $(window).width() - 200 + $(window).width() * (i - 1))
    }

    $(".enemy1").speed(0.4);
    $(".enemy1").moveTo(270);
    $(".fly").speed(0.4);
    $(".fly").moveTo(0);
    $(".fly").autoBounceOff(true);
    $(".fly").autoRemoveOffScreen(false);

}

// Check if lose all lifes
function checkLife() {

    if (life == 0) {
        clearInterval(level1Completed);
        //remove current game
        $('#Level1').remove();
        $('#WelcomeScreen').fadeIn();
        $('.license').remove();
        $('.button_start').remove();
        $(".score_display").text(score);
        //display game over screen
        $('#GameOverScreen').fadeIn();
    }
}

