---
title: "DALL·E 2 — мои первые эксперименты с возможностями нейросети"
originalUrl: "https://habr.com/ru/articles/680136/"
sourceName: "Habr"
category: "article"
archiveDate: 2026-01-11
publishDate: 2022-07-31
description: "Еще в прошлом году я в свое время подавался в лист ожидания для того чтобы опробовать нейросеть GPT3 для генерации текстов, и спустя достаточно длительное ожидание она попала ко мне в руки, и даже в..."
coverImage: "/archives/habr-dalle2/cover.jpg"
images:
  - "/archives/habr-dalle2/image-1.jpg"
  - "/archives/habr-dalle2/image-2.jpg"
  - "/archives/habr-dalle2/image-3.jpg"
  - "/archives/habr-dalle2/image-4.jpg"
  - "/archives/habr-dalle2/image-5.jpg"
  - "/archives/habr-dalle2/image-6.jpg"
  - "/archives/habr-dalle2/image-7.jpg"
  - "/archives/habr-dalle2/image-8.jpg"
  - "/archives/habr-dalle2/image-9.jpg"
  - "/archives/habr-dalle2/image-10.jpg"
  - "/archives/habr-dalle2/image-11.jpg"
  - "/archives/habr-dalle2/image-12.jpg"
  - "/archives/habr-dalle2/image-13.jpg"
  - "/archives/habr-dalle2/image-14.jpg"
  - "/archives/habr-dalle2/image-15.jpg"
  - "/archives/habr-dalle2/image-16.jpg"
  - "/archives/habr-dalle2/image-17.jpg"
  - "/archives/habr-dalle2/image-18.jpg"
  - "/archives/habr-dalle2/image-19.jpg"
---

# DALL·E 2 — мои первые эксперименты с возможностями нейросети

*Это архивная копия статьи. [Оригинал на Habr](https://habr.com/ru/articles/680136/)*

---


Еще в прошлом году я в свое время подавался в лист ожидания для того чтобы опробовать нейросеть GPT3 для генерации текстов, и спустя достаточно длительное ожидание она попала ко мне в руки, и даже в рабочем проекте мы с ней поэкспериментировали.

И когда Open AI открыли возможность получить доступ к их новой нейросети DALL·E 2 я конечно же воспользовался возможностью и вот на прошлой неделе и она попала мне в руки.

_Сразу предупреждаю - в статье я не буду погружаться в технические детали, а просто покажу результаты тестов, причем без выбора самых лучших вариантов, а только то что получил в первых результатах_

* * *

### Введение — а что это за DALL·E 2 такая?

Немного про саму нейросеть DALL·E 2 — она создана для генерации изображений на основе пользовательского описания.

[https://openai.com/dall-e-2/](https://openai.com/dall-e-2/) — на сайте проекта достаточно подробно и с примерами показывается что эта штука уже может, но я добавлю пару примеров в статью, чтобы у вас как у читателя сразу был некоторый контекст.

![Астронавт отдыхающий в тропическом отеле в космосе в фотореалистичном стиле](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b86/cda/dea/b86cdadea1402c7a5ce5cd795a4067e7.jpeg)

Астронавт отдыхающий в тропическом отеле в космосе в фотореалистичном стиле

![Тарелка супа которая является порталом в другое измерение как «digital art» («цифровое искусство»)](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3fb/840/ac7/3fb840ac708302198d110bae421a7ee1.jpeg)

Тарелка супа которая является порталом в другое измерение как «digital art» («цифровое искусство»)

![Астронавт верхом на лошади как карандашный рисунок](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ba1/fe0/80b/ba1fe080bc1a4c11841146cb83628c5a.jpeg)

Астронавт верхом на лошади как карандашный рисунок

Также кроме создания изображений с нуля, данная нейросеть способна модифицировать изображения дорисовывая что-то на них, так и создавать варианты исходного изображения.

![Пример создания вариантов из исходного изображения](https://habrastorage.org/r/w1560/getpro/habr/upload_files/17d/264/02e/17d26402ee6dc85233417763d9272ff5.jpeg)

Пример создания вариантов из исходного изображения

![Пример модификации изображения — нейросеть попросили дорисовать диван](https://habrastorage.org/r/w1560/getpro/habr/upload_files/274/632/64f/27463264fe190404748f653c90f53675.jpeg)

Пример модификации изображения — нейросеть попросили дорисовать диван

Итак, после того как все мы поняли что же эта штука умеет, настало время проверить это на практике.

### Тесты нейросети

Этот вариант генерации вышел несколько абстрактным, но в целом неплохо

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d1e/2c7/fbc/d1e2c7fbcb9021d876b34fcce948d5c5.jpeg)

![Unreal engine 5 space station background inspired with space games and films](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a4a/826/fa3/a4a826fa308ec0a051221e69e8db133f.jpeg)

Unreal engine 5 space station background inspired with space games and films

**Viewst team (developers, designers, managers and so on) making coding and sales of they wysiwyg software what helps create animated banners in Leonardo da Vinci styles**

Как видно получается неплохо, задумка похожа на стоковые фотографии о командах которые делают свои дизайнерско\\разработческие и прочие дела, но вот качество лиц конечно подкачало на «фотореалистичных вариантах»

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a8e/67c/8d5/a8e67c8d571a527a91a5597a5a9ee9bf.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/fa4/c85/340/fa4c85340efe1aaed6b0dcb2f10fee99.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/55f/d9a/600/55fd9a600517092b38489d07e2965492.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/adf/53a/bc9/adf53abc941eac2b1a4a4fcace425372.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/239/afb/e53/239afbe532588150fef2530bbb5966a1.jpeg)

Теперь перейдем к другим стилям

**Realistic oil painting of Doggy in medieval armor with viewst chameleon logo on shield fighting with dragon of low sales**

_(Реалистичная масляная живопись изображающую Догги в средневековой броне с Viewst логотипом хамелеоном на щите сражающейся с драконом низких цен)_

А вот это уже весьма круто выглядит и более чем соответствует запросу — не считая отсутствия дракона низких цен :)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1bc/ae5/68a/1bcae568ae125f2a5a1e1b5b392ea07d.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/fee/fa6/039/feefa6039d61c909382bb4e27d70eca8.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ecc/d69/622/eccd6962236ccfe6a72e50f456ffa25c.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a90/51c/6c1/a9051c6c1387fb44cdfd3f8d2f206011.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/25f/c50/fd0/25fc50fd0f9e8d7623bfe3d3c02d046c.jpeg)

**Photo of cosplayers with costumes from games, films, anime before they go on stage to show whey work and performance**

_(Фото косплееров с костюмами по играм, фильмам и аниме перед тем как они выйдут на сцену показать свою работу и выступление)_

Опять мы видим проблему с лицами людей (и любовь по всей видимости к аниме у нейросети :) )

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1f0/775/061/1f07750616879b26d088b15cf4152045.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/951/c7c/b04/951c7cb04b52a7fa70a13b12d967ea7d.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a1d/da2/312/a1dda23129d998b4c31402fe3129a436.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c8f/005/acf/c8f005acf41bc8d597bc8e7b77f20cc6.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/591/ee1/6eb/591ee16eb09dc23b54497d6dab95830f.jpeg)

А теперь попробуем поменять стиль для такого запроса

**Digital art of cosplayers with costumes from games, films, anime before they go on stage to show whey work and performance**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/098/0f8/7e4/0980f87e424a2c2efe02e3afd2d174ba.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ffd/3ea/74e/ffd3ea74e38d6f7c7ef6e5e83f4762e6.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1df/200/b17/1df200b174b1f6a4db9e0f33e0b03e90.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/575/c87/8d3/575c878d33d199310629e64dab1f4ea5.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f03/07c/ba8/f0307cba8dfb1565cce95a36b18f1cd4.jpeg)

И для картинки с девушкой с фиолетовыми волосами я решил посмотреть как сработает функция создания вариантов — и получилось более чем достойно

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/8d4/824/b10/8d4824b1003a63a500466fe629778161.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1d3/2f2/d69/1d32f2d6962f60c1b1afe8542dbb5aa2.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/4be/85a/e22/4be85ae22140cf5619a88c20fdd25d7f.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3f5/005/526/3f5005526dca7b6793bf94203a229957.jpeg)

**Pixel art of cosplayers with costumes from games, films, anime before they go on stage to show whey work and performance**

И пиксель арт получается достаточно интересный

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/162/bd7/87a/162bd787a1b95d39d4912bc1578d9d0c.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c05/13e/db8/c0513edb851cb00f12eb9b0fadf8b1e9.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/2f2/83c/bda/2f283cbda029ea081428ebf9f2c5b8d4.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ec0/893/375/ec0893375c12445051dbefdb8bb6911a.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f57/44f/9b9/f5744f9b9b2b944800e2f8af610627e4.jpeg)

А теперь пришло время пейзажей. Как вариант я решил посмотреть что же может сделать нейросеть касательно моего родного города Рыбинска, и насколько это будет похоже на открыточные виды.

**An impressionist watercolor painting of Rybinsk with view from water on bridge, museum and church at summer time**

Этим результатом я был очень впечатлен, так как на многих фотографиях обычно как раз фигурирует собор, здание музея с красной крышей и мостом через волгу

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/502/928/846/502928846b60c457cb80f6e01e1d484a.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f45/52b/345/f4552b34577289931603bdd12b27ea4d.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/9d3/a8f/94f/9d3a8f94f675dc3cd9fbc673d091aab2.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3bb/3dd/9bc/3bb3dd9bc730d97c0e6ce4d1cc2ce19f.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3f2/d86/a0e/3f2d86a0e82db3178a08ec7dca54243f.jpeg)

И для примера фотография

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/534/a0a/a95/534a0aa95bf9244f018b01c3e587f0fd.jpeg)

Затем для того же запроса я попросил сделать еще вариантов, и вот что получилось

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d3b/6af/4cd/d3b6af4cdbecf7acb64b80627985a0e7.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a01/538/c92/a01538c927142ee280ae1a03cfe1af05.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/7ae/068/a14/7ae068a1405a873dc5afc15b9dabc21b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/0ac/57d/12b/0ac57d12b41e7de1a220e0437077da5d.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c75/0a0/4d1/c750a04d12de89802088bbad974771f8.jpeg)

А затем я решил посмотреть на варианты пейзажей с осенью вместо лета и сменить стиль с акварели на масло

**An impressionist oil painting painting of Rybinsk with view from water on bridge, museum and church at autumn time**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/95b/2c8/171/95b2c81712b6a17379e6fd61e0d418e0.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/17f/837/a7b/17f837a7b5881977f2f02455743fb557.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/060/92d/ed1/06092ded195a54ad4e722519ffb4e4bb.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/71e/d4e/418/71ed4e418b0a743ba1bd874bc17863c7.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/461/d54/f22/461d54f22d82e63ce895ce261c0e91d6.jpeg)

Затем я решил попробовать режим работы с созданием вариантов по готовому изображению.

**Я взял картинку медведя-пивовара из моего туристического пэт-проекта, и запросил нейросеть создать другие варианты эскиза.** И получилось на удивление не плохо

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/739/8f1/418/7398f1418906868ea810fdc842e1b039.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/8e1/cb2/1f1/8e1cb21f1ba8fb0e3a30395f9b6caecb.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f6e/e07/4f8/f6ee074f82082d0f72b14560fe6f70f5.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/525/266/dcf/525266dcff2dfaeec25b75eb25e38a14.jpeg)

Затем я опробовал вариант дорисовки\\перерисовки изображения — взял картинку медведя, и запросил **Bear in engineering helmet and blueprints in hands** и разметив область головы и рук (вместо секиры)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/6a7/e7f/c41/6a7e7fc41b9412338f3290727461bb22.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/e6b/534/945/e6b534945af22473a70b5931c9baf165.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/104/848/fbb/104848fbb336e8c6b6f2a6383b36b956.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1cc/a94/cab/1cca94cabd34160949bd5a37f95df689.jpeg)

Далее я решил посмотреть, что будет если разметить все изображение как возможное место для перерисовки с запросом **Bear in watercolor type with Rybinsk museum background**

Как видно, в таком случае сеть никак по большей части не отталкивается от предыдущего стиля изображения, а только от текстового описания.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3c1/917/ceb/3c1917ceb8c394d33799501482d571e1.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/cd7/bf5/887/cd7bf588764def0f347d0ceb6804ab5e.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/92e/1b9/60e/92e1b960e6e79f6959218094b2879899.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ea4/ac8/e85/ea4ac8e856669b732dea309b6b476831.jpeg)

И еще раз попробовал варианты, в этот раз вышло более коряво для медведя с секирой

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/599/8d6/4c7/5998d64c7681de2a8e9c90d7e2d08d8c.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/219/ed0/181/219ed01817651e5f3498dba0ebdc5d16.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f82/fed/d0a/f82fedd0ab201b30e7cdb3e03b55134c.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/860/755/e1a/860755e1a8ae70d77d86e793dd234445.jpeg)

Продолжим пробы с вариантами — тут я использовал свою фотографию с фестиваля в косплее на Иванушку из Морозко

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1d1/2d8/668/1d12d866822722e349446d06b5e049dd.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b32/4a6/386/b324a6386f65a6ac0eea4727c9885e49.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/41f/d2f/ff2/41fd2fff27b03897767e87254342617d.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/cb4/4cf/8b5/cb44cf8b54a53fcd193e3d6310654a0e.jpeg)

Еще варианты косплейной фотографии, на этот раз с моим Айзеком из Dead Space 2

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/27d/2f7/46b/27d2f746be6d5262d21526f6a7d95eb2.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/155/b29/4b0/155b294b0e6798c08be7e3b97d3bfe75.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c5e/425/de4/c5e425de448ee9edc0d95873391edf48.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/1b8/b07/0af/1b8b070af71118621582c5f9b647d865.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/59f/ba9/c39/59fba9c39b2ddc1df6beb6960ea03ed1.jpeg)

И еще немного перерисовки фотографии с запросом **Phot if Russian summer forest** _(да, я опечатался)_

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b15/1cc/7f5/b151cc7f511c61c6c8f44d1ed4269fd0.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/daa/0c6/dcc/daa0c6dcc21f8f42e0b580d01aa75a83.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/be7/421/083/be742108349f2f34b131d023b988257f.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/02c/de6/b76/02cde6b7600c59c47da35ed7d36406b0.jpeg)

А теперь продолжим с безумными запросами, часть из которых мне подсказали)

**Wrestler in ball gown** _(рестлер в бальном платье)_

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b00/046/176/b00046176c3df2e6f1b60cfd239315ff.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/784/2ec/564/7842ec564075fa7b56655da09eb2f4be.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5e7/8e3/c0e/5e78e3c0e2b4a95b696ca82da5bb92ff.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/23d/86a/d5e/23d86ad5e02a87a6c8b3084da0eb10f5.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/488/ee2/820/488ee2820cb918ef338884ea0e8513d4.jpeg)

**Wrestler in ball gown from renesanse time in style of Yan van Eyk**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/376/76d/482/37676d482eb555eb9a8292554559043f.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/698/9bf/b0a/6989bfb0aedd4a27a29cbc86d0c5c623.jpeg)

**DND dwarf monk character who likes cats and use as iron apples to fight for balance in a world** _(ДНД персонаж гном монах который любит котов и использует железные яблоки для того чтобы бороться за баланс в мире)_

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/42c/322/18e/42c32218edf93ea6a9830b751397ec2f.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d27/188/e2b/d27188e2b9be054aa36f5ff847c83490.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/54c/ea2/126/54cea2126008054e1056b664fbd5bd59.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/0cb/9e5/51c/0cb9e551cd705117ea60d7fe6f8a38f6.jpeg)

**DND dwarf monk character who likes cats and use as iron apples to fight for balance in a world in unreal engine 5 style**

И вот что будет если мы чуток поменяем запрос и попросим стиль Unreal Engine 5

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/026/ed2/d3b/026ed2d3bc0a7280c956dd4e7ffab55a.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5e2/3cf/0e7/5e23cf0e71d085e3f95d92c546f6e45f.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d05/975/fff/d05975fff116774a02a6ed1ab82ea834.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/630/f4a/992/630f4a9929b0b71146ecf9e2938c88e9.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/912/8ea/34e/9128ea34ef19417cc374442fd03141c3.jpeg)

**Warhammer elf mage character riding a white Chinese dragon in unreal engine 5 style** _(Warhammer персонаж маг-эльф верхом на белом китайском драконе в стиле Unreal Engine 5)_

Продолжим фэнтези тематику

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/56d/c2d/118/56dc2d1184f0c28e056db4a9a1082b2e.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/4d0/6ab/375/4d06ab37538bc4b59bb795bf158df806.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/bc0/142/3ff/bc01423ffcbf0892854ca04cfcb9df35.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5ce/b9f/95a/5ceb9f95aecc9d9bb5313f1f25417c88.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ede/98b/cbe/ede98bcbe522dd2e2e109daa8721c499.jpeg)

**Warhammer elf mage character riding a white Chinese dragon** _(Warhammer персонаж маг-эльф верхом на белом китайском драконе)_

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/6c7/3ef/363/6c73ef363fc012e5a74ea8a1d21aa383.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c0c/0c6/d62/c0c0c6d62eecd1ecafc726039d580426.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/51d/02d/a39/51d02da393625940e0b3d9c93b622618.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/cb2/e53/669/cb2e536698c464e88eb7353f591d057a.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/abb/721/66b/abb72166b172113e6f253c0fb3b76249.jpeg)

**“Warhammer elf mage character riding a white Chinese dragon” by Yan van Eyk**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ddb/362/4e2/ddb3624e2448d473f75d8d1da5133ad3.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5be/08b/cd4/5be08bcd49734a7af8c6948329c5bc18.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c9d/89a/536/c9d89a536978159854783a650fe5000e.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c9f/af0/fd0/c9faf0fd001dec83af8be47fcb58bb30.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/bf0/5b1/448/bf05b14483ec62d35fef40060c0910c5.jpeg)

**Проба работы с вариантами логотипа**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/517/df6/52e/517df652e20408b884c0f34fa75de3e7.jpeg)

**Medieval cockatiel tapestry**

И еще один подсказанный запрос который вышел просто потрясающе

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/117/148/786/117148786554e0e54c32a1f8d452fc6b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/736/419/6c9/7364196c9f1abf321867dbfba1c458c5.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/cd5/3c4/265/cd53c4265c3ea10b60ff47842a296f15.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/23e/552/1e3/23e5521e300c6132befae79e91a099ca.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/e01/82d/67e/e0182d67edb0e0422fb367b690b5ebb9.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/182/679/97a/18267997a9fc1ae99f6e20d309b1066c.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f89/ed4/854/f89ed485402d372906ba150631aa61df.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/582/a87/cc1/582a87cc17cd29121d34d6cd35f9bc4b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/634/724/fee/634724feec560dfdf16229134a59cae2.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/526/6cc/943/5266cc943398787b5ff9e8cbc93b5ad5.jpeg)

Продолжаем тему

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/da0/fe2/929/da0fe292922171e9784902111bd637ef.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/61c/b38/770/61cb387700c087b9b2bb18e46c56930e.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/910/17e/daf/91017edaf7aeaf833a160b9ca3d7506b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/e5c/4d6/9a9/e5c4d69a9a7c513591348b5c46a21d25.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/170/cbc/f3c/170cbcf3c220fe7314c77ee5982ecf64.jpeg)

**Medieval cockatiel tapestry as wallpapers in modern house**

И вариант с попугаями выше в виде обоев

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/9a5/13f/83e/9a513f83ed95b375ed5c3fc86447f45b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ca0/688/eee/ca0688eee843b7c33d6a4237124d5291.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b8c/4ef/8c7/b8c4ef8c7defa199ae198347544eaf1c.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5be/6bd/b1b/5be6bdb1bb4b50bde6ac58afe1b4f9c7.jpeg)

**Красивый лес в стиле Шишкина с гигантскими мухоморами и охотниками за шишками**

А теперь проверим как нейронка «понимает» другие языки, в частности русский — как мы видим в целом про лес и шишки и мухоморы понято, но уже не так хорошо.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/6db/382/cc3/6db382cc3b50e84eccb23e388974c0f9.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a75/e28/731/a75e287313ee45c4da17ebce7cb0303b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/7e0/aa8/7e5/7e0aa87e5d75703333d743f881c3472a.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/72e/779/5a3/72e7795a3cb2088b4b59d734993e3b3d.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d52/3c1/238/d523c123852a1e21ceeb44c6cf8716f7.jpeg)

**Photorealistic 3d render of donut with blue glaze and small yellow hearts and pearls on glaze in purple room**

Продолжим с вариантами генерации изображений. Данный запрос я составил, чтобы посмотреть получится ли что-то похожее [на работу в 3d от @Troxx\_cosplay](https://twitter.com/Troxx_cosplay/status/1550895846031609857?s=20&t=7yKufqLykT0iM7OjzXEdaQ)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/dde/d79/251/dded79251c1e783d6dcd62ddcf2fd134.jpeg)

И вот что получилось

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/eaa/6f9/171/eaa6f9171ab3d32db70342a120256cd1.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/729/9df/caa/7299dfcaa6a9ded41de1636a913dc901.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a32/473/133/a3247313347a03a96f1234d61ce268a9.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/67f/7a2/63e/67f7a263e9d62f1f94e6841a7f5d7fd2.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d95/a38/804/d95a388045b3297dcb40c912c216b8cf.jpeg)

**Oil painting of landscape with road going through field surrounded by forest. Road goes to giant grey concrete building, with few small windows on top. All landscape is foggy**

Продолжаем тему пейзажей

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a8c/fd4/f30/a8cfd4f30ac1b51e83d4fa76ff5a02bb.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b05/09f/d43/b0509fd43441fcbfd7a260a06fe81d0b.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b91/f4f/dda/b91f4fdda011cc2badfa5236cfd8fa49.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/465/de5/4f2/465de54f23ce0dfc89ac2657fb347e62.jpeg)

**Еще немного работы с вариантами картинки**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/9ee/580/c2f/9ee580c2f58e37bd2caef6308815abbe.jpeg)

**Young woman not tall with short blue hair and many earrings with feathers and stones in light jacket, brown shirts, high socks and army shoes in watercolor style**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/00c/4f8/35c/00c4f835c24a5cf46941f4f11b2bc5a4.jpeg)

**Кокадутиэль**

И тут отлично выглядящие пейзажи

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ea7/e09/24c/ea7e0924cd9749bb0b27be581f4f59ec.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b33/752/ac1/b33752ac1b086773895c2a3f8e024729.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/33a/164/4d7/33a1644d73053dfc4ff8e8c1213f5965.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ed2/430/de8/ed2430de86b66b95d6766dbf8f3c4ff4.jpeg)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/fcb/acc/5aa/fcbacc5aac168c96c2791f458add3cbf.jpeg)

**“Front end and backend developers arguing to create ultimate developer”by Leonardo da Vinci**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3fd/2a5/14a/3fd2a514a119fb9a05ba0956ce48b963.jpeg)

**Front end and backend developers arguing to create ultimate developer in medival style**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a59/dfb/681/a59dfb68123bda7173482249c47fa464.jpeg)

**Disco elisium detective fighting his destiny in medival style**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/19d/3c7/c61/19d3c7c61ec5a5e7ab83c5e3ac7482a3.jpeg)

* * *

Что же можно сказать по итогу (после того как я потратил все доступные бесплатные лимиты).

Это уже очень интересный инструмент для тех же идей с референсами для художников, иногда (особенно с пейзажами) чуть ли не готовый инструмент чтобы сделать картину и повесить ее на стену, штука чтобы сделать себе иллюстрации для твоей статьи (как это к примеру часто сейчас делает [Denis Sexy IT](https://t.me/s/denissexy)) а иногда генератор очень странных лиц и ситуаций.

Так что нас ждет очень интересное будущее :)
