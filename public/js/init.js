$.fn.frenifyMoveCursorToEnd = function() {
    "use strict";
    this.focus();
    var e = this.val();
    return this.val("").val(e), this
};
var FrenifyTechWaveTime = new Date;
! function(e) {
    "use strict";
    var t = 0,
        a = !1,
        o = !1,
        n = "",
        s = "",
        i = 0,
        r = {
            init: function() {
                this.marquee(), this.tooltip(), this.fontDialog(), this.modelTabs(), this.bookmark(), this.contactForm(), this.negativePrompt(), this.imageGenerationSidebar(), this.rangeSlider(), this.quantity(), this.selectModel(), this.anchor(), this.aiChatBot__chat(), this.aiChatBotOptions(), this.aiChatBotTextareaHeight(), this.billingProgress(), this.inputFileOnChange(), this.optionsList(), this.pricingTab(), this.feedFilters(), this.report(), this.follow(), this.copyLink(), this.galleryIsotope(), this.imageLightbox(), this.like(), this.accordion(), this.search(), this.animatedText(), this.movingSubMenuForLeftPanel(), this.panelResize(), this.navBarItems(), this.redetectFullScreen(), this.fullSCreen(), this.navSubMenu(), this.imgToSVG(), this.BgImg(), this.popupMobile()
            },
            marquee: function() {
                e(".TickerNews .marquee").each(function() {
                    var t = e(this);
                    t.hasClass("ready") || t.addClass("ready").marquee({
                        duplicated: !0,
                        duration: 1e3 * parseInt(t.data("speed")),
                        delayBeforeStart: 0,
                        direction: "left",
                        startVisible: !0
                    })
                })
            },
            popupMobile: function() {
                if (window.matchMedia("(max-width: 767px)").matches) {
                    var t = e(".techwave_fn_wrapper").width();
                    e(".item__popup,.fn__nav_bar .item_popup").each(function() {
                        var a = e(this),
                            o = a.parent(),
                            n = t - 20,
                            s = Math.min(n, 300),
                            i = o.offset().left,
                            r = 10 - i + (n - s) / 2,
                            l = "auto";
                        "right" === a.data("position") ? i + o.width() > s && (r = "auto", l = 0) : i + s < n && (r = 0), a.css({
                            maxWidth: s,
                            width: s,
                            left: r,
                            right: l
                        })
                    })
                } else e(".fn__nav_bar .item_popup,.item__popup").attr("style", "")
            },
            tooltip: function() {
                e("body").on("mouseover mouseenter", ".fn__tooltip", function() {
                    var t = e(this),
                        a = t.attr("data-position");
                    (void 0 === a || !0 === a) && (a = ["top", "bottom", "right", "left"]);
                    var o = {
                        contentAsHTML: "true",
                        maxWidth: 300,
                        animationDuration: 0,
                        animation: "fade",
                        delay: 0,
                        theme: "tooltipster-techwave",
                        side: a
                    };
                    if (t.hasClass("menu__item") && !e("html").hasClass("panel-opened")) {
                        t.tooltipster(o).tooltipster("hide");
                        return
                    }
                    t.tooltipster(o), t.tooltipster("show")
                })
            },
            fontDialog: function() {
                var t = e(".techwave_fn_font");
                e(".font__trigger").off().on("click", function() {
                    return t.addClass("opened"), !1
                }), t.find(".font__closer").off().on("click", function() {
                    return t.removeClass("opened"), !1
                }), t.find(".font__closer_link").off().on("click", function() {
                    return t.removeClass("opened"), !1
                }), t.find(".apply").off().on("click", function() {
                    return e(".fn__chat_font_size_style").remove(), e("body").append('<style type="text/css" class="fn__chat_font_size_style">frenify_typing h3,.fn__chatbot .chat{font-size: ' + e("#font_size").find(":selected").val() + "px;}</style>"), t.removeClass("opened"), !1
                })
            },
            modelTabs: function() {
                e(".techwave_fn_models .fn__tabs a").off().on("click", function() {
                    var t = e(this);
                    if (!t.hasClass("active") && !o) {
                        o = !0, t.siblings().removeClass("active"), t.addClass("active");
                        var a = t.closest(".techwave_fn_models");
                        a.find(".models__results").addClass("loading"), setTimeout(function() {
                            a.find(".models__results").removeClass("loading"), a.find(".tab__item.active").removeClass("active"), e(t.attr("href")).addClass("active"), o = !1
                        }, 1500)
                    }
                    return !1
                })
            },
            contactForm: function() {
                e("#send_message").on("click", function() {
                    var t = e(".fn_contact_form #name").val(),
                        a = e(".fn_contact_form #email").val(),
                        o = e(".fn_contact_form #tel").val(),
                        n = e(".fn_contact_form #message").val(),
                        s = e(".fn_contact_form .returnmessage").data("success");
                    return e(".fn_contact_form .returnmessage").empty(), "" === t || "" === a || "" === n ? e(".fn_contact_form .empty_notice").slideDown(500).delay(2e3).slideUp(500) : e.post("modal/contact.php", {
                        ajax_name: t,
                        ajax_email: a,
                        ajax_message: n,
                        ajax_tel: o
                    }, function(t) {
                        e(".fn_contact_form .returnmessage").append(t), e(".fn_contact_form .returnmessage span.contact_error").length ? e(".fn_contact_form .returnmessage").slideDown(500).delay(2e3).slideUp(500) : (e(".fn_contact_form .returnmessage").append("<span class='contact_success'>" + s + "</span>"), e(".fn_contact_form .returnmessage").slideDown(500).delay(4e3).slideUp(500)), "" === t && e("#fn_contact_form")[0].reset()
                    }), !1
                })
            },
            negativePrompt: function() {
                e("#negative_prompt").on("change", function() {
                    this.checked ? e(".techwave_fn_image_generation_page .exclude_area").slideDown(200) : e(".techwave_fn_image_generation_page .exclude_area").slideUp(200)
                })
            },
            imageGenerationSidebar: function() {
                e(".techwave_fn_image_generation_page .sidebar__trigger").off().on("click", function() {
                    return e(".techwave_fn_wrapper").toggleClass("fn__has_sidebar"), !1
                })
            },
            rangeSlider: function() {
                e(".fn__range").each(function() {
                    var t = e(this),
                        a = t.find("input"),
                        o = a.val(),
                        n = t.find(".value"),
                        s = a.attr("min"),
                        i = a.attr("max"),
                        r = t.find(".slider");
                    r.css({
                        width: o * (100 * s) / i + "%"
                    }), a.on("input", function() {
                        o = e(this).val(), n.text(o), r.css({
                            width: o * (100 * s) / i + "%"
                        })
                    })
                })
            },
            quantity: function() {
                e(".fn__quantity .increase").off().on("click", function() {
                    var t = e(this).closest(".fn__quantity").find("input"),
                        a = parseInt(t.attr("max"), 10),
                        o = parseInt(t.val(), 10);
                    return o = isNaN(o) ? 0 : o, a !== o && (o++, t.val(o), !1)
                }), e(".fn__quantity .decrease").off().on("click", function() {
                    var t = e(this).closest(".fn__quantity").find("input"),
                        a = parseInt(t.val(), 10),
                        o = parseInt(t.attr("min"), 10);
                    return a = isNaN(a) ? 0 : a, o !== a && (a--, t.val(a), !1)
                })
            },
            selectModel: function() {
                e(".fn__select_model .model_open").off().on("click", function() {
                    return e(this).closest(".fn__select_model").toggleClass("opened"), !1
                }), e(window).on("click", function() {
                    e(".fn__select_model").removeClass("opened")
                }), e(".fn__select_model .all_models").on("click", function(e) {
                    e.stopPropagation()
                })
            },
            anchor: function() {
                e(".techwave_fn_doc_page .docsidebar li.menu-item-has-children > a").off().on("click", function() {
                    return e(this).siblings("ul").slideToggle(), !1
                }), e().onePageNav && e(".techwave_fn_doc_page .docsidebar > ul").onePageNav()
            },
            aiChatBot__chat: function() {
                e("#fn__chat_textarea").length && !e(".techwave_fn_intro").length && e("#fn__chat_textarea").focus(), e("#fn__chat_textarea").keypress(function(t) {
                    var a = t.keyCode ? t.keyCode : t.which;
                    if (13 === a && t.shiftKey);
                    else if (13 === a) return e(".fn__chat_comment button").trigger("click"), !1
                }), e(".fn__chat_comment button").off().on("click", function() {
                    var t = e(this),
                        a = e("#fn__chat_textarea"),
                        o = a.val();
                    if (!("" === o || t.hasClass("disabled"))) {
                        s = o = o.replace(/\n\r?/g, "<br />");
                        var n = e(".fn__chatbot .chat__item.active"),
                            i = '<div class="chat__box your__chat"><div class="author"><span>You</span></div><div class="chat"><p>' + o + "</p></div></div>";
                        if (e(".fn__chat_comment").removeClass("neww"), "chat0" === n.attr("id")) {
                            n.removeClass("active"), e(".fn__new_chat_link").removeClass("active");
                            var l = e(".fn__chatbot .chat__item").length;
                            e(".fn__chatbot .chat__list").append('<div class="chat__item active" id="chat' + l + '">' + i + "</div>");
                            var h = '<li class="group__item"><div class="fn__chat_link active" href="#chat' + l + '"><span class="text">New Chat</span><input type="text" value="New Chat"><span class="options"><button class="trigger"><span></span></button><span class="options__popup"><span class="options__list"><button class="edit">Edit</button><button class="delete">Delete</button></span></span></span><span class="save_options"><button class="save"><img src="svg/check.svg" alt="" class="fn__svg"></button><button class="cancel"><img src="svg/close.svg" alt="" class="fn__svg"></button></span></div></li>';
                            e(".fn__chatbot .chat__group.new").length ? e(".fn__chatbot .chat__group.new ul").append(h) : e(".fn__chatbot .sidebar_content").prepend('<div class="chat__group"><h2 class="group__title">Today</h2><ul class="group__list">' + h + "</ul></div>"), r.imgToSVG(), r.aiChatBotOptions()
                        } else n.append(i);
                        return a.val(""), a.siblings(".fn__hidden_textarea").val(""), r.aiChatBotTextareaHeight(), e(".techwave_fn_intro").length ? e("html, body").animate({
                            scrollTop: a.offset().top - e(window).height() + 100
                        }) : e("html, body").animate({
                            scrollTop: e(document).height() - e(window).height()
                        }), a.frenifyMoveCursorToEnd(), r.frenifyChat(), !1
                    }
                })
            },
            frenifyChat: function() {
                var t = "",
                    a = !0,
                    o = "";
                i = e(".fn__chatbot .chat__item.active .chat__box").length;
                var n = {
                    welcome: {
                        type: "text",
                        description: "welcome message",
                        text: "<p>Frenify was founded in 2017. The company began working with the first customers, giving them the opportunity to purchase high-quality HTML templates.</p><p>The company’s products began to grow in terms of complexity and aesthetics. Frenify currently has a wide range of HTML templates, WordPress themes, WordPress plugins, Photoshop projects; paid and absolutely free products.</p><p>Design projects are unique and aesthetically pleasing based on customer requirements. Visit our website to get acquainted with our products. Thank you so much for being with us.</p>",
                        append: !0
                    },
                    about: {
                        type: "text",
                        description: "some information about the Frenify team",
                        text: "<p>Frenify was founded in 2017. The company began working with the first customers, giving them the opportunity to purchase high-quality HTML templates.</p><p>The company’s products began to grow in terms of complexity and aesthetics. Frenify currently has a wide range of HTML templates, WordPress themes, WordPress plugins, Photoshop projects; paid and absolutely free products.</p><p>Design projects are unique and aesthetically pleasing based on customer requirements. Visit our website to get acquainted with our products. Thank you so much for being with us.</p>",
                        append: !0
                    },
                    website: {
                        type: "url",
                        description: "go to our official website",
                        append: !1,
                        url: "https://frenify.com/"
                    },
                    free: {
                        type: "url",
                        description: "get PSD files of premium themes for free",
                        append: !1,
                        url: "https://frenify.com/freebies/"
                    },
                    doc: {
                        type: "url",
                        description: "visit online documentation for TechWave HTML template",
                        append: !1,
                        url: "https://frenify.com/work/envato/frenify/html/techwave/doc"
                    },
                    support: {
                        type: "url",
                        description: "if you have any questions regarding TechWave HTML template feel free and contact us by this command",
                        append: !1,
                        url: "https://themeforest.net/item/techwave-ai-html-dashboard-for-image-generation-chat-bot/46197058/support/contact"
                    },
                    purchase: {
                        type: "url",
                        description: "open the template description page on themeforest to purchase it",
                        append: !1,
                        url: "https://themeforest.net/item/techwave-ai-html-dashboard-for-image-generation-chat-bot/46197058"
                    },
                    youtube: {
                        type: "url",
                        description: "visit our youtube channel with video guides on our themes and templates",
                        append: !1,
                        url: "https://www.youtube.com/@frenifyteam/videos"
                    },
                    pass: {
                        type: "password",
                        description: "if you want to get strong password I can generate it for you, write <frenify_main>/pass 20</frenify_main> to get a 20 character password",
                        append: !0
                    },
                    joke: {
                        type: "joke",
                        description: "I can cheer you up by telling a joke",
                        append: !0
                    },
                    time: {
                        type: "time",
                        description: "display current time",
                        append: !0
                    },
                    clear: {
                        type: "clear",
                        description: "to clear current chat",
                        append: !1
                    },
                    commands: {
                        type: "commands",
                        description: "to list all available commands",
                        append: !0
                    }
                };
                o = "<ul>", e.each(n, function(e, t) {
                    o += "<li><frenify_main>/" + e + "</frenify_main> - " + t.description + "</li>"
                });
                var l = "<p>Hello.</p><p>I am Frenify Bot. After purchasing the template, you can delete me easily. I understand some commands. You just select one of the commands and write here.</p><p>Here is the list of commands:</p>" + (o += "</ul>") + "<p>We are trying for you. We try to make unique themes and templates with excellent functionality and excellent design.</p>";
                n.welcome.text = l;
                var h = ["What did one pirate say to the other when he beat him at chess?<>Checkmatey.", "I burned 2000 calories today<>I left my food in the oven for too long.", "I startled my next-door neighbor with my new electric power tool. <>I had to calm him down by saying “Don’t worry, this is just a drill!”", "I broke my arm in two places. <>My doctor told me to stop going to those places.", "I quit my job at the coffee shop the other day. <>It was just the same old grind over and over.", "I never buy anything that has Velcro with it...<>it’s a total rip-off.", "I used to work at a soft drink can crushing company...<>it was soda pressing.", "I wondered why the frisbee kept on getting bigger. <>Then it hit me.", "I was going to tell you a fighting joke...<>but I forgot the punch line.", "What is the most groundbreaking invention of all time? <>The shovel.", "I’m starting my new job at a restaurant next week. <>I can’t wait.", "I visited a weight loss website...<>they told me I have to have cookies disabled.", "Did you hear about the famous Italian chef that recently died? <>He pasta way.", "Broken guitar for sale<>no strings attached.", "I could never be a plumber<>it’s too hard watching your life’s work go down the drain.", "I cut my finger slicing cheese the other day...<>but I think I may have grater problems than that.", "What time did you go to the dentist yesterday?<>Tooth-hurty.", "What kind of music do astronauts listen to?<>Neptunes.", "Rest in peace, boiled water. <>You will be mist.", "What is the only concert in the world that costs 45 cents? <>50 Cent, featuring Nickelback.", "It’s not a dad bod<> it’s a father figure.", "My wife recently went on a tropical food diet and now our house is full of this stuff. <>It’s enough to make a mango crazy.", "What do you call Santa’s little helpers? <>Subordinate clauses.", "Want to hear a construction joke? <>Sorry, I’m still working on it.", "What’s the difference between a hippo and a zippo? <>One is extremely big and heavy, and the other is a little lighter.", "I burnt my Hawaiian pizza today in the oven, <>I should have cooked it on aloha temperature.", "Anyone can be buried when they die<>but if you want to be cremated then you have to urn it.", "Where did Captain Hook get his hook? <>From the second-hand store.", "I am such a good singer that people always ask me to sing solo<>solo that they can’t hear me.", "I am such a good singer that people ask me to sing tenor<>tenor twelve miles away.", "Occasionally to relax I just like to tuck my knees into my chest and lean forward.<> That’s just how I roll.", "What did the glass of wine say to the glass of beer? Nothing. <>They barley knew each other.", "I’ve never trusted stairs. <>They are always up to something.", "Why did Shakespeare’s wife leave him? <>She got sick of all the drama.", "I just bought a dictionary but all of the pages are blank. <>I have no words to describe how mad I am.", "If you want to get a job at the moisturizer factory... <>you’re going to have to apply daily.", "I don’t know what’s going to happen next year. <>It’s probably because I don’t have 2020 vision.", "Want to hear a joke about going to the bathroom? <>Urine for a treat.", "I couldn’t figure out how to use the seat belt. <>Then it just clicked.", "I got an email the other day teaching me how to read maps backwards<>turns out it was just spam.", "I’m reading a book about anti-gravity.<> It’s impossible to put down!", "You’re American when you go into the bathroom, and you’re American when you come out, but do you know what you are while you’re in there?<> European.", "Did you know the first French fries weren’t actually cooked in France?<> They were cooked in Greece.", "Want to hear a joke about a piece of paper? Never mind... <>it’s tearable.", "I just watched a documentary about beavers. <>It was the best dam show I ever saw!", "If you see a robbery at an Apple Store what re you?<> An iWitness?", "Spring is here! <>I got so excited I wet my plants!", "What’s Forrest Gump’s password?<> 1forrest1", "Why did the Clydesdale give the pony a glass of water? <>Because he was a little horse!", 'CASHIER: "Would you like the milk in a bag, sir?" <>DAD: "No, just leave it in the carton!’”', "Did you hear about the guy who invented Lifesavers? <>They say he made a mint.", "I bought some shoes from a drug dealer.<> I don’t know what he laced them with, but I was tripping all day!", "Why do chicken coops only have two doors?<> Because if they had four, they would be chicken sedans!", "How do you make a Kleenex dance? <>Put a little boogie in it!", 'A termite walks into a bar and asks<>"Is the bar tender here?"', "Why did the invisible man turn down the job offer?<> He couldn’t see himself doing it.", "I used to have a job at a calendar factory <>but I got the sack because I took a couple of days off.", 'A woman is on trial for beating her husband to death with his guitar collection. Judge says, "First offender?" <>She says, "No, first a Gibson! Then a Fender!”', "How do you make holy water?<> You boil the hell out of it.", "I had a dream that I was a muffler last night.<> I woke up exhausted!", "Did you hear about the circus fire?<> It was in tents!", "Don’t trust atoms.<> They make up everything!", "How many tickles does it take to make an octopus laugh? <>Ten-tickles.", "I’m only familiar with 25 letters in the English language.<> I don’t know why.", "Why did the cow in the pasture get promoted at work?<> Because he is OUT-STANDING in his field!", "What do prisoners use to call each other?<> Cell phones.", "Why couldn’t the bike standup by itself? <>It was two tired.", "Who was the fattest knight at King Arthur’s round table?<> Sir Cumference.", "Did you see they made round bails of hay illegal in Wisconsin? <>It’s because the cows weren’t getting a square meal.", "You know what the loudest pet you can get is?<> A trumpet.", "What do you get when you cross a snowman with a vampire?<> Frostbite.", "What do you call a deer with no eyes?<> No idea!", "Can February March? <>No, but April May!", "What do you call a lonely cheese? <>Provolone.", "Why can’t you hear a pterodactyl go to the bathroom?<> Because the pee is silent.", "What did the buffalo say to his son when he dropped him off at school?<> Bison.", "What do you call someone with no body and no nose? <>Nobody knows.", "You heard of that new band 1023MB? <>They’re good but they haven’t got a gig yet.", "Why did the crab never share?<> Because he’s shellfish.", "How do you get a squirrel to like you? <>Act like a nut.", "Why don’t eggs tell jokes? <>They’d crack each other up.", "Why can’t a nose be 12 inches long? <>Because then it would be a foot.", "Did you hear the rumor about butter? <>Well, I’m not going to spread it!", "I made a pencil with two erasers. <>It was pointless.", "I used to hate facial hair...<>but then it grew on me.", "I decided to sell my vacuum cleaner—<>it was just gathering dust!", "I had a neck brace fitted years ago<> and I’ve never looked back since.", "You know, people say they pick their nose,<> but I feel like I was just born with mine.", "What do you call an elephant that doesn’t matter?<> An irrelephant.", "What do you get from a pampered cow? <>Spoiled milk.", "It’s inappropriate to make a ’dad joke’ if you’re not a dad.<> It’s a faux pa.", "How do lawyers say goodbye? <>Sue ya later!", "Wanna hear a joke about paper? <>Never mind—it’s tearable.", "What’s the best way to watch a fly fishing tournament? <>Live stream.", "I could tell a joke about pizza,<> but it’s a little cheesy.", "When does a joke become a dad joke?<> When it becomes apparent.", "What’s an astronaut’s favorite part of a computer? <>The space bar.", "What did the shy pebble wish for?<>That she was a little boulder.", "I’m tired of following my dreams. <>I’m just going to ask them where they are going and meet up with them later.", "Did you hear about the guy whose whole left side was cut off? <>He’s all right now.", "Why didn’t the skeleton cross the road? <>Because he had no guts.", "What did one nut say as he chased another nut? <> I’m a cashew!", "Chances are if you’ve seen one shopping center...<> you’ve seen a mall.", "I knew I shouldn’t steal a mixer from work...<>but it was a whisk I was willing to take.", "How come the stadium got hot after the game? <>Because all of the fans left.", "Why was it called the dark ages? <>Because of all the knights.", "Why did the tomato blush? <>Because it saw the salad dressing.", "Did you hear the joke about the wandering nun? <>She was a roman catholic.", "What creature is smarter than a talking parrot? <>A spelling bee.", "I’ll tell you what often gets over looked...<> garden fences.", "Why did the kid cross the playground? <>To get to the other slide.", "Why do birds fly south for the winter?<> Because it’s too far to walk.", "What is a centipedes’s favorite Beatle song? <> I want to hold your hand, hand, hand, hand...", "My first time using an elevator was an uplifting experience. <>The second time let me down.", "To be Frank...<> I’d have to change my name.", "Slept like a log last night … <>woke up in the fireplace.", "Why does a Moon-rock taste better than an Earth-rock? <>Because it’s a little meteor.", "How many South Americans does it take to change a lightbulb?<> A Brazilian", "I don’t trust stairs.<> They’re always up to something.", "A police officer caught two kids playing with a firework and a car battery.<> He charged one and let the other one off.", "What is the difference between ignorance and apathy?<>I don’t know and I don’t care.", "I went to a Foo Fighters Concert once... <>It was Everlong...", "Some people eat light bulbs. <>They say it’s a nice light snack.", "What do you get hanging from Apple trees? <> Sore arms.", "Last night me and my girlfriend watched three DVDs back to back.<> Luckily I was the one facing the TV.", "I got a reversible jacket for Christmas,<> I can’t wait to see how it turns out.", "What did Romans use to cut pizza before the rolling cutter was invented? <>Lil Caesars", "My pet mouse ’Elvis’ died last night. <>He was caught in a trap..", "Never take advice from electrons. <>They are always negative.", "Why are oranges the smartest fruit? <>Because they are made to concentrate. ", "What did the beaver say to the tree? <>It’s been nice gnawing you.", "How do you fix a damaged jack-o-lantern?<> You use a pumpkin patch.", "What did the late tomato say to the early tomato? <>I’ll ketch up", "I have kleptomania...<>when it gets bad, I take something for it.", "I used to be addicted to soap...<> but I’m clean now.", "When is a door not a door?<> When it’s ajar.", "I made a belt out of watches once...<> It was a waist of time.", "This furniture store keeps emailing me,<> all I wanted was one night stand!", "How do you find Will Smith in the snow?<>  Look for fresh prints.", "I just read a book about Stockholm syndrome.<> It was pretty bad at first, but by the end I liked it.", "Why do trees seem suspicious on sunny days? <>Dunno, they’re just a bit shady.", "If at first you don’t succeed<> sky diving is not for you!", "What kind of music do mummy’s like?<>Rap", "A book just fell on my head. <>I only have my shelf to blame.", "What did the dog say to the two trees? <>Bark bark.", "If a child refuses to sleep during nap time...<> are they guilty of resisting a rest?", "Have you ever heard of a music group called Cellophane?<> They mostly wrap.", "What did the mountain climber name his son?<>Cliff.", "Why should you never trust a pig with a secret?<> Because it’s bound to squeal.", "Why are mummys scared of vacation?<> They’re afraid to unwind.", "Whiteboards ...<> are remarkable.", "What kind of dinosaur loves to sleep?<>A stega-snore-us.", "What kind of tree fits in your hand?<> A palm tree!", "I used to be addicted to the hokey pokey<> but I turned myself around.", "How many tickles does it take to tickle an octopus?<> Ten-tickles!", "What musical instrument is found in the bathroom?<> A tuba toothpaste.", "My boss told me to attach two pieces of wood together... <>I totally nailed it!", "What was the pumpkin’s favorite sport?<>Squash.", "What do you call corn that joins the army?<> Kernel.", "I’ve been trying to come up with a dad joke about momentum <>but I just can’t seem to get it going.", "Why don’t sharks eat clowns? <> Because they taste funny.", "Just read a few facts about frogs.<> They were ribbiting.", "Why didn’t the melons get married?<>Because they cantaloupe.", "What’s a computer’s favorite snack?<>Microchips!", "Why was the robot so tired after his road trip?<>He had a hard drive.", "Why did the computer have no money left?<>Someone cleaned out its cache!", "I’m not anti-social. <>I’m just not user friendly.", "Why did the computer get cold?<>Because it forgot to close windows.", "What is an astronaut’s favorite key on a keyboard?<>The space bar!", "What’s the difference between a computer salesman and a used-car salesman?<>The used-car salesman KNOWS when he’s lying.", "If at first you don’t succeed...<> call it version 1.0", "Why did Microsoft PowerPoint cross the road?<>To get to the other slide!", "What did the computer do at lunchtime?<>Had a byte!", "Why did the computer keep sneezing?<>It had a virus!", "What did one toilet say to the other?<>You look a bit flushed.", "Why did the picture go to jail?<>Because it was framed.", "What did one wall say to the other wall?<>I’ll meet you at the corner.", "What do you call a boy named Lee that no one talks to?<>Lonely", "Why do bicycles fall over?<>Because they are two-tired!", "Why was the broom late?<>It over swept!", "What part of the car is the laziest?<>The wheels, because they are always tired!", "What’s the difference between a TV and a newspaper?<>Ever tried swatting a fly with a TV?", "What did one elevator say to the other elevator?<>I think I’m coming down with something!", "Why was the belt arrested?<>Because it held up some pants!", "What makes the calendar seem so popular?<>Because it has a lot of dates!", "Why did Mickey Mouse take a trip into space?He wanted to find Pluto!", "Why do you go to bed every night?<>Because the bed won’t come to you!", "What has four wheels and flies?<>A garbage truck!", "Why did the robber take a bath before he stole from the bank?<>He wanted to make a clean get away!", "Just watched a documentary about beavers.<>It was the best damn program I’ve ever seen.", "Slept like a log last night<>woke up in the fireplace.", "Why did the scarecrow win an award?<>Because he was outstanding in his field.", "Why does a chicken coop only have two doors? <>Because if it had four doors it would be a chicken sedan.", "What’s the difference between an African elephant and an Indian elephant? <>About 5000 miles", "Why did the coffee file a police report? <>It got mugged.", "What did the grape do when he got stepped on? <>He let out a little wine.", "How many apples grow on a tree? <>All of them.", "What name do you give a person with a rubber toe? <>Roberto", "Did you hear about the kidnapping at school? <>It’s fine, he woke up.", "Why do scuba divers fall backwards into the water? <>Because if they fell forwards they’d still be in the boat.", "How does a penguin build it’s house? <>Igloos it together.", "What do you call a man with a rubber toe?<>Roberto", "Did you hear about the restaurant on the moon?<>Great food, no atmosphere.", "Why was the belt sent to jail?<>For holding up a pair of pants!", "Did you hear about the scientist who was lab partners with a pot of boiling water?<>He had a very esteemed colleague.", "What happens when a frogs car dies?<>He needs a jump. If that doesn’t work he has to get it toad.", "What did the flowers do when the bride walked down the aisle?<>They rose.", "Why did the man fall down the well?<>Because he couldn’t see that well.", "My boss told me to have a good day...<>...so I went home.", "How can you tell it’s a dogwood tree?<>By the bark.", "Did you hear about the kidnapping at school?<>It’s fine, he woke up.", "Why is Peter Pan always flying?<>Because he Neverlands.", "Which state has the most streets?<>Rhode Island.", "What do you call 26 letters that went for a swim?<>Alphawetical.", "Why was the color green notoriously single?<>It was always so jaded.", "Why did the coach go to the bank?<>To get his quarterback.", "How do celebrities stay cool?<>They have many fans.", "What’s the most depressing day of the week?<>sadder day.", "Dogs can’t operate MRI machines<>But catscan.", "I was going to tell a time-traveling joke<>but you guys didn’t like it.", "Stop looking for the perfect match<>instead look for a lighter.", "I told my doctor I heard buzzing<>but he said it’s just a bug going around.", "What kind of car does a sheep like to drive?<>A lamborghini.", "What did the accountant say while auditing a document?<>This is taxing.", "What did the two pieces of bread say on their wedding day?<>It was loaf at first sight.", "Why do melons have weddings?<>Because they cantaloupe.", "What did the drummer call his twin daughters?<>Anna One, Anna Two!", "What do you call a toothless bear?<> A gummy bear!", "Two goldfish are in a tank. <>One says to the other, “Do you know how to drive this thing?”", "What’s Forrest Gump’s password?<>1forrest1", "What is a child guilty of if they refuse to nap?<> Resisting a rest.", "I know a lot of jokes about retired people<>but none of them work.", "Why are spiders so smart?<>They can find everything on the web.", "What has one head, one foot, and four legs?<> A bed.", "What does a house wear?<> Address.", "What’s red and smells like blue paint?<>Red paint.", "My son asked me to put his shoes on<> but I don’t think they’ll fit me.", "I’ve been bored recently, so I decided to take up fencing.<> The neighbors keep demanding that I put it back.", "What do you call an unpredictable camera?<>A loose Canon.", "Which U.S. state is known for its especially small soft drinks?<>Minnesota.", "What do sprinters eat before a race?<> Nothing—they fast.", "I’m so good at sleeping...<>I can do it with my eyes closed.", "People are usually shocked that I have a Police record.<>But I love their greatest hits!", "I told my girlfriend she drew on her eyebrows too high.<> She seemed surprised.", "What do you call a fibbing cat?<> A lion.", "Why shouldn’t you write with a broken pencil?<> Because it’s pointless.", "I like telling Dad jokes…<>sometimes he laughs.", "How do you weigh a millennial?<> In Instagrams.", "The wedding was so beautiful<>even the cake was in tiers.", "What’s the most patriotic sport?<> Flag football.", ],
                    c = !1;
                if (1 === i) t = l;
                else if ("/" === s.slice(0, 1)) {
                    var d = s.substring(1),
                        f = /pass \d/i,
                        u = 15;
                    f.test(d) && (u = d.split(" ")[1], d = "pass");
                    var p = 1;
                    if ((f = /joke \d/i).test(d) && (p = d.split(" ")[1], d = "joke"), n.hasOwnProperty(d)) {
                        var m = n[d],
                            g = m.type;
                        if ("text" === g) t = m.text;
                        else if ("url" === g) window.location.href = m.url;
                        else if ("password" === g) {
                            var y = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789![]{}()%&*$#^<>~@|",
                                v = "";
                            u > 1e3 && (t += "<p>I don't think that you want to get this password. Maximum password characters are: 1000.</p><p>Your password with 1000 characters:</p>", u = 1e3);
                            for (var w = 0; w < u; w++) v += y.charAt(Math.floor(Math.random() * y.length));
                            t += "<frenify_uselect>" + (v = r.escapeHTML(v)) + "</frenify_uselect>"
                        } else if ("time" === g) {
                            var b, k = new Date,
                                C = 10 > k.getHours() ? "0" + k.getHours() : k.getHours();
                            t = C + ":" + (10 > k.getMinutes() ? "0" + k.getMinutes() : k.getMinutes()) + ":" + (10 > k.getSeconds() ? "0" + k.getSeconds() : k.getSeconds())
                        } else if ("clear" === g) e(".fn__chatbot .chat__item.active").html("");
                        else if ("joke" === g) {
                            if (p > 1) {
                                var I = r.shuffleArray(h).slice(0, p);
                                if (t = "<ul>", p >= 1 && p <= h.length)
                                    for (var W = 0; W < p; W++) t += "<li>" + I[W] + "</li>";
                                t += "</ul>"
                            } else t = h[Math.floor(Math.random() * h.length)]
                        } else "commands" === g && (t = o);
                        a = m.append
                    } else c = !0
                } else c = !0;
                c && (t = '<p>I only understand some commands. Of course, this is a fixable problem. Buy this template and implement AI and that\'s it. Go to the template site where you can buy? Visit item\'s website: <a href="https://themeforest.net/user/frenify/portfolio" target="_blank">TechWave</a></p><p>Write <frenify_main>/commands</frenify_main> to list all available commands.'), a && (e(".fn__chat_comment button").addClass("disabled"), setTimeout(function() {
                    e(".fn__chatbot .chat__item.active").append('<div class="chat__box bot__chat"><div class="author"><span>Frenify Bot</span></div><div class="chat"><frenify_typing><h3><span>Typing...</frenify></h3></div></div>'), e(".techwave_fn_intro").length ? e("html, body").animate({
                        scrollTop: e("#fn__chat_textarea").offset().top - e(window).height() + 100
                    }) : e("html, body").animate({
                        scrollTop: e(document).height() - e(window).height()
                    })
                }, 100), setTimeout(function() {
                    e(".fn__chatbot .chat__item.active .chat__box.bot__chat:last-child .chat").html(t), e(".fn__chat_comment button").removeClass("disabled"), e(".techwave_fn_intro").length ? e("html, body").animate({
                        scrollTop: e("#fn__chat_textarea").offset().top - e(window).height() + 100
                    }) : e("html, body").animate({
                        scrollTop: e(document).height() - e(window).height()
                    })
                }, 2e3))
            },
            shuffleArray: function(e) {
                for (var t, a = e.length; 0 !== a;) t = Math.floor(Math.random() * a), a--, [e[a], e[t]] = [e[t], e[a]];
                return e
            },
            escapeHTML: function(e) {
                var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;",
                    "`": "&#x60;",
                    "=": "&#x3D;"
                };
                return String(e).replace(/[&<>"'`=\/]/g, function(e) {
                    return t[e]
                })
            },
            aiChatBotOptions: function() {
                e(".fn__chat_link").off().on("click", function() {
                    var t = e(this);
                    return t.hasClass("active") || (e(".fn__chat_link.active").removeClass("active"), e(".fn__chatbot .chat__item.active").removeClass("active"), t.addClass("active"), e(t.attr("href")).addClass("active"), i = e(t.attr("href")).find(".chat__box").length, e(".fn__new_chat_link").removeClass("active"), e(".fn__chat_comment").removeClass("neww"), e(".fn__chatbot .fn__title_holder .title").text(t.find(".text").text()), "" === e(t.attr("href")).html() && e(".fn__chat_comment").addClass("neww")), e("#fn__chat_textarea").frenifyMoveCursorToEnd(), !1
                }), e(".fn__new_chat_link").off().on("click", function() {
                    var t = e(this);
                    return t.hasClass("active") || (e(".fn__chat_link.active").removeClass("active"), e(".fn__chatbot .chat__item.active").removeClass("active"), t.addClass("active"), e(t.attr("href")).addClass("active"), i = 0, e(".fn__chatbot .fn__title_holder .title").text("New Chat")), e(".fn__chat_comment").addClass("neww"), e("#fn__chat_textarea").frenifyMoveCursorToEnd(), !1
                }), e(".fn__chat_link input").off().on("click", function(e) {
                    e.stopPropagation()
                }), e(".fn__chat_link .trigger").off().on("click", function() {
                    var t = e(this).closest(".fn__chat_link");
                    return t.hasClass("opened") ? t.removeClass("opened") : t.addClass("opened"), !1
                }), e(".fn__chat_link .edit").off().on("click", function() {
                    var t = e(this).closest(".fn__chat_link"),
                        a = t.find("input");
                    return t.addClass("live_edit").removeClass("opened"), n = a.val(), setTimeout(function() {
                        a.frenifyMoveCursorToEnd()
                    }, 100), !1
                }), e(".fn__chat_link .cancel").off().on("click", function() {
                    var t = e(this).closest(".fn__chat_link"),
                        a = t.find("input");
                    return t.removeClass("live_edit"), a.val(n), !1
                }), e(".fn__chat_link .save").off().on("click", function() {
                    var t = e(this).closest(".fn__chat_link"),
                        a = t.find("input");
                    return t.removeClass("live_edit"), n = a.val(), t.find(".text").text(n), !1
                }), e(window).on("click", function() {
                    e(".fn__chat_link").removeClass("opened")
                }), e(".fn__chat_link .options__popup").on("click", function(e) {
                    e.stopPropagation()
                })
            },
            aiChatBotTextareaHeight: function() {
                e("#fn__chat_textarea").on("mouseup keyup", function() {
                    var t = e(this),
                        a = t.val(),
                        o = t.siblings(".fn__hidden_textarea");
                    o.val(a);
                    var n = Math.floor((o[0].scrollHeight - 34) / 22);
                    t.css({
                        height: 22 * n + 34 + 4
                    }), n > 6 ? t.css({
                        overflowY: "auto"
                    }) : t.css({
                        overflowY: "hidden"
                    })
                }), e("#fn__include_textarea").on("mouseup keyup", function() {
                    var t = e(this),
                        a = t.val(),
                        o = t.siblings(".fn__hidden_textarea");
                    o.val(a);
                    var n = Math.floor((o[0].scrollHeight - 34) / 22);
                    t.css({
                        height: 22 * n + 34 + 4
                    }), n > 6 ? t.css({
                        overflowY: "auto"
                    }) : t.css({
                        overflowY: "hidden"
                    })
                }), e("#fn__exclude_textarea").on("mouseup keyup", function() {
                    var t = e(this),
                        a = t.val(),
                        o = t.siblings(".fn__hidden_textarea");
                    o.val(a);
                    var n = Math.floor((o[0].scrollHeight - 34) / 22);
                    t.css({
                        height: 22 * n + 34 + 4
                    }), n > 6 ? t.css({
                        overflowY: "auto"
                    }) : t.css({
                        overflowY: "hidden"
                    })
                })
            },
            billingProgress: function() {
                e(".techwave_fn_user_billing .progress").each(function() {
                    var t = e(this);
                    t.waypoint({
                        handler: function() {
                            t.hasClass("active") || setTimeout(function() {
                                t.css("--frenify-progress", t.data("percentage")), t.addClass("active")
                            }, 500)
                        },
                        offset: "90%"
                    })
                })
            },
            inputFileOnChange: function() {
                e(".fn__upload").on("change", function(t) {
                    var a = e(this),
                        o = t.target.files[0];
                    o && a.addClass("has_img").find(".preview_img").attr("src", URL.createObjectURL(o))
                }), e(".fn__upload .fn__closer").on("click", function() {
                    var t = e(this).closest(".fn__upload");
                    return t.removeClass("has_img"), t.find(".preview_img").attr("src", "#"), t.find('input[type="file]').val(""), !1
                })
            },
            optionsList: function() {
                e(".fn__options_list a").off().on("click", function() {
                    var t = e(this);
                    return t.hasClass("enabled") ? t.removeClass("enabled").addClass("disabled") : t.removeClass("disabled").addClass("enabled"), !1
                })
            },
            pricingTab: function() {
                e(".techwave_fn_pricing .toggle_in").each(function() {
                    var t = e(this),
                        a = t.find(".active"),
                        o = a.offset().left - t.offset().left;
                    t.find(".bg").css({
                        left: o,
                        width: a.outerWidth(!0, !0)
                    })
                }), e(".techwave_fn_pricing .toggle_in a").off().on("click", function() {
                    var t = e(this);
                    if (!t.hasClass("active")) {
                        var a = t.closest(".toggle_in"),
                            o = t.closest(".techwave_fn_pricing"),
                            n = t.offset().left - a.offset().left;
                        o.find(".pricing__tab.active").removeClass("active"), e(t.attr("href")).addClass("active"), t.siblings().removeClass("active"), t.addClass("active"), a.find(".bg").css({
                            left: n,
                            width: t.outerWidth(!0, !0)
                        })
                    }
                    return !1
                })
            },
            feedFilters: function() {
                e('.techwave_fn_feed .filter__select input[type="checkbox"]').change(function() {
                    var t = e(this),
                        a = t.is(":checked"),
                        o = t.closest(".techwave_fn_feed"),
                        n = o.find(".fn__gallery_items .item");
                    a ? (n.addClass("select__ready"), o.find(".fn__selection_box").slideDown(200)) : (n.removeClass("select__ready"), o.find(".fn__selection_box").slideUp(200))
                }), e(".fn__selectable_item").off().on("click", function() {
                    var a = e(this),
                        o = a.closest(".techwave_fn_community_page");
                    return o.find(".fn__gallery_items .item"), a.hasClass("selected") ? (a.removeClass("selected"), t--) : (a.addClass("selected"), t++), o.find(".fn__selection_box .count").text(t), !1
                }), e(".techwave_fn_feed .fn__tabs a").on("click", function() {
                    var t = e(this);
                    if (!t.hasClass("active") && !a) {
                        a = !0, t.siblings().removeClass("active"), t.addClass("active");
                        var o = t.closest(".techwave_fn_feed");
                        o.find(".feed__results").addClass("loading"), setTimeout(function() {
                            o.find(".feed__results").removeClass("loading"), a = !1, r.galleryIsotope()
                        }, 1500)
                    }
                    return !1
                }), e(".techwave_fn_feed .filter__sorting a").on("click", function() {
                    var t = e(this);
                    if (!t.hasClass("enabled") && !a) {
                        a = !0, t.siblings().removeClass("enabled").addClass("disabled"), t.removeClass("disabled").addClass("enabled");
                        var o = t.closest(".techwave_fn_feed");
                        o.find(".feed__results").addClass("loading"), setTimeout(function() {
                            o.find(".feed__results").removeClass("loading"), a = !1
                        }, 1500)
                    }
                    return !1
                }), e('.techwave_fn_feed .filter__upscaled input[type="checkbox"]').change(function() {
                    var t = e(this);
                    t.is(":checked");
                    var a = t.closest(".techwave_fn_feed");
                    a.find(".feed__results").addClass("loading"), setTimeout(function() {
                        a.find(".feed__results").removeClass("loading")
                    }, 1500)
                }), e(".techwave_fn_feed .filter__search a").on("click", function() {
                    if (!a) {
                        var t = e(this).closest(".techwave_fn_feed");
                        t.find(".feed__results").addClass("loading"), setTimeout(function() {
                            t.find(".feed__results").removeClass("loading"), a = !1
                        }, 1500)
                    }
                    return !1
                })
            },
            report: function() {
                var t = e(".techwave_fn_report");
                e(".fn__report").off().on("click", function() {
                    return e(this).data("id"), t.hasClass("opened") ? t.removeClass("opened") : t.addClass("opened"), !1
                }), t.find(".cancel").off().on("click", function() {
                    return t.removeClass("opened"), !1
                }), t.find(".fn__closer").off().on("click", function() {
                    return t.removeClass("opened"), !1
                }), t.find(".report__closer").off().on("click", function() {
                    return t.removeClass("opened"), !1
                })
            },
            follow: function() {
                e(".fn__follow").off().on("click", function() {
                    var t = e(this),
                        a = t.find(".text");
                    return t.data("id"), t.hasClass("has__follow") ? (t.removeClass("has__follow"), a.text(t.data("follow-text"))) : (t.addClass("has__follow"), a.text(t.data("unfollow-text"))), !1
                })
            },
            copyLink: function() {
                e(".fn__copy").off().on("click", function() {
                    var t = e(this),
                        a = t.text(),
                        o = t.data("copied"),
                        n = t.attr("data-text"),
                        s = t.attr("href");
                    void 0 !== n && !1 !== n && (s = n);
                    var i = e("<input>");
                    return e("body").append(i), i.val(s).select(), document.execCommand("copy"), i.remove(), t.text(o).delay(1e3).queue(function(e) {
                        t.text(a), e()
                    }), !1
                })
            },
            galleryIsotope: function() {
                var t = e(".fn__gallery_items");
                e().isotope && t.each(function() {
                    e(this).isotope({
                        percentPosition: !0,
                        itemSelector: ".fn__gallery_item",
                        masonry: {}
                    })
                })
            },
            imageLightbox: function() {
                var t = e("body"),
                    a = 0;
                e(".fn__gallery_items .item").off().on("click", function() {
                    var n = e(this);
                    return n.data("id"), n.hasClass("select__ready") || (o.scrollTop(0), a = document.documentElement.style.getPropertyValue("--techwave-scroll-y"), t.css({
                        position: "fixed",
                        top: a
                    }), t.addClass("fn__lightbox_mode"), o.addClass("opened")), !1
                });
                var o = e(".techwave_fn_img_lightbox");
                o.find(".fn__closer").off().on("click", function() {
                    t.removeClass("fn__lightbox_mode"), o.removeClass("opened"), t.css({
                        position: "relative",
                        top: ""
                    }), setTimeout(function() {
                        window.scrollTo({
                            top: 300,
                            left: 0,
                            behavior: "instant"
                        }), r.galleryIsotope()
                    }, 1)
                })
            },
            bookmark: function() {
                e(".fn__bookmark").off().on("click", function() {
                    var t = e(this);
                    return t.hasClass("has__bookmark") ? t.removeClass("has__bookmark") : t.addClass("has__bookmark"), !1
                })
            },
            like: function() {
                e(".fn__like").off().on("click", function() {
                    var t = e(this),
                        a = t.find(".count");
                    return t.data("id"), t.hasClass("has__like") ? (t.removeClass("has__like"), a.text(parseInt(a.text()) - 1)) : (t.addClass("has__like"), a.text(parseInt(a.text()) + 1)), !1
                })
            },
            accordion: function() {
                e(".techwave_fn_accordion").each(function() {
                    e(this).find(".opened .acc__content").slideDown(300)
                }), e(".techwave_fn_accordion .acc__header").on("click", function() {
                    var t = e(this),
                        a = t.closest(".acc__item"),
                        o = t.closest(".techwave_fn_accordion"),
                        n = a.find(".acc__content"),
                        s = o.data("type");
                    a.hasClass("opened") ? (a.removeClass("opened"), n.slideUp(300)) : ("accordion" === s && (o.find(".acc__item").removeClass("opened"), o.find(".acc__content").slideUp(300)), a.addClass("opened"), n.slideDown(300))
                })
            },
            search: function() {
                var t = e(".techwave_fn_searchbar"),
                    a = t.find(".search__input"),
                    o = t.find(".search__results");
                e(".fn__nav_bar .bar__item_search .item_opener").on("click", function() {
                    return t.addClass("opened"), setTimeout(function() {
                        a[0].focus()
                    }, 100), !1
                }), t.find(".search__closer").on("click", function() {
                    return a.val(""), o.removeClass("opened"), t.removeClass("opened"), !1
                });
                var n = null;
                a.on("keyup", function() {
                    var t = e(this).val();
                    clearTimeout(n), n = setTimeout(function() {
                        "" === t ? o.removeClass("opened") : o.addClass("opened")
                    }, 700)
                })
            },
            animatedText: function() {
                e(".fn__animated_text").each(function() {
                    var t = e(this),
                        a = t.text().split(""),
                        o = t.data("wait");
                    o || (o = 0);
                    var n = t.data("speed");
                    n || (n = 4), n /= 100, t.html("<em>321...</em>").addClass("ready"), t.waypoint({
                        handler: function() {
                            t.hasClass("stop") || (t.addClass("stop"), setTimeout(function() {
                                t.text(""), e.each(a, function(e, a) {
                                    var o = document.createElement("span");
                                    o.textContent = a, o.style.animationDelay = e * n + "s", t.append(o)
                                })
                            }, o))
                        },
                        offset: "90%"
                    })
                })
            },
            movingSubMenuForLeftPanel: function() {
                var t = e(".techwave_fn_fixedsub"),
                    a = e(".techwave_fn_leftpanel .group__list > li"),
                    o = e(".techwave_fn_content");

                function n() {
                    o.on("mouseenter", function() {
                        t.removeClass("opened"), a.removeClass("hovered").parent().removeClass("hovered")
                    })
                }
                a.on("mouseenter", function() {
                    var o = e(this),
                        s = o.children("ul.sub-menu"),
                        i = s.html();
                    s.length ? (a.removeClass("hovered"), o.addClass("hovered").parent().addClass("hovered"), t.removeClass("opened").children("ul").html("").html(i), t.addClass("opened")) : (a.removeClass("hovered"), t.removeClass("opened"), o.removeClass("hovered").parent().removeClass("hovered"));
                    var r = o.offset().top,
                        l = e(".techwave_fn_leftpanel .leftpanel_content").offset().top;
                    t.css({
                        top: r - l
                    }), n()
                }), n()
            },
            panelResize: function() {
                var t = e("html");
                e(".techwave_fn_leftpanel .desktop_closer").off().on("click", function() {
                    return t.hasClass("panel-opened") ? (t.removeClass("panel-opened"), localStorage.frenify_panel = "") : (t.addClass("panel-opened"), localStorage.frenify_panel = "panel-opened"), !1
                }), e(".techwave_fn_leftpanel .mobile_closer").off().on("click", function() {
                    return t.hasClass("mobile-panel-opened") ? t.removeClass("mobile-panel-opened") : t.addClass("mobile-panel-opened"), !1
                })
            },
            navBarItems: function() {
                var t = e(".fn__nav_bar .bar__item_user");
                t.find(".user_opener").on("click", function(a) {
                    return a.stopPropagation(), t.hasClass("opened") ? t.removeClass("opened") : t.addClass("opened"), e(".bar__item_language,.bar__item_notification").removeClass("opened"), !1
                }), t.on("click", function(e) {
                    e.stopPropagation()
                }), e(window).on("click", function() {
                    t.removeClass("opened")
                }), e(".fn__nav_bar .bar__item_skin .item_opener").off().on("click", function() {
                    return "light" === e("html").attr("data-techwave-skin") ? (e("html").attr("data-techwave-skin", "dark"), localStorage.frenify_skin = "dark") : (e("html").attr("data-techwave-skin", "light"), localStorage.frenify_skin = "light"), e(".bar__item_user,.bar__item_language,.bar__item_notification").removeClass("opened"), !1
                });
                var a = e(".fn__nav_bar .bar__item_language");
                a.find(".item_opener").on("click", function(t) {
                    return t.stopPropagation(), a.hasClass("opened") ? a.removeClass("opened") : a.addClass("opened"), e(".bar__item_user,.bar__item_notification").removeClass("opened"), !1
                }), a.on("click", function(e) {
                    e.stopPropagation()
                }), e(window).on("click", function() {
                    a.removeClass("opened")
                });
                var o = e(".fn__nav_bar .bar__item_notification");
                o.find(".item_opener").on("click", function(t) {
                    return t.stopPropagation(), o.hasClass("opened") ? o.removeClass("opened") : o.addClass("opened"), e(".bar__item_user,.bar__item_language").removeClass("opened"), !1
                }), o.on("click", function(e) {
                    e.stopPropagation()
                }), e(window).on("click", function() {
                    o.removeClass("opened")
                })
            },
            redetectFullScreen: function() {
                var t = e(".fn__nav_bar .bar__item_fullscreen a");
                window.innerHeight === screen.height ? t.addClass("full_screen") : t.removeClass("full_screen")
            },
            fullSCreen: function() {
                var t = e(".fn__nav_bar .bar__item_fullscreen a");
                t.off().on("click", function() {
                    return t.hasClass("full_screen") ? (t.removeClass("full_screen"), document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()) : (t.addClass("full_screen"), document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.msRequestFullscreen ? document.documentElement.msRequestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)), !1
                })
            },
            navSubMenu: function() {
                e(".techwave_fn_leftpanel .menu-item-has-children > a").off().on("click", function() {
                    var t = e(this).closest("li");
                    return t.hasClass("closed") ? (t.removeClass("closed"), t.children("ul").slideDown(200)) : (t.addClass("closed"), t.children("ul").slideUp(200)), !1
                })
            },
            preloader: function() {
                var t = e(".techwave_fn_preloader"),
                    a = new Date - FrenifyTechWaveTime,
                    o = 4e3;
                a < o ? o -= a : o = 0, t.hasClass("wait_for_full_preloading_animation") || (o = 0), setTimeout(function() {
                    t.addClass("fn_ready")
                }, o), setTimeout(function() {
                    t.remove()
                }, o + 2e3)
            },
            imgToSVG: function() {
                e("img.fn__svg").each(function() {
                    var t = e(this),
                        a = t.attr("class"),
                        o = t.attr("src");
                    e.get(o, function(o) {
                        var n = e(o).find("svg");
                        void 0 !== a && (n = n.attr("class", a + " replaced-svg")), t.replaceWith(n)
                    }, "xml")
                })
            },
            BgImg: function() {
                e("*[data-bg-img]").each(function() {
                    var t = e(this),
                        a = t.attr("data-bg-img"),
                        o = t.data("bg-img");
                    void 0 !== a && t.css({
                        backgroundImage: "url(" + o + ")"
                    })
                })
            }
        };
    e(document).ready(function() {
        r.init(), e(":root").css("--techwave-scroll-y", -1 * window.scrollY + "px"), setTimeout(function() {
            r.galleryIsotope()
        }, 500)
    }), e(window).on("resize", function() {
        r.popupMobile(), r.redetectFullScreen(), r.galleryIsotope()
    }), e(window).on("load", function() {
        r.preloader(), r.galleryIsotope(), setTimeout(function() {
            r.galleryIsotope()
        }, 1e3)
    }), e(window).on("scroll", function() {
        e(":root").css("--techwave-scroll-y", -1 * window.scrollY + "px")
    })
}(jQuery);