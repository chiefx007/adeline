pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const container = document.getElementById("book");

const pageIndicator = document.getElementById("currentPage");
const totalIndicator = document.getElementById("totalPages");

const pageInput = document.getElementById("pageInput");
const goButton = document.getElementById("goPage");

let pdf;

const pageFlip = new St.PageFlip(container, {

width:450,
height:600,

size:"stretch",

minWidth:280,
maxWidth:1000,

minHeight:400,
maxHeight:1350,

showCover:false,

mobileScrollSupport:false

});


pdfjsLib.getDocument("book.pdf").promise.then(async loadedPdf => {

pdf = loadedPdf;

totalIndicator.textContent = pdf.numPages;

const pages = [];

for(let i=0;i<pdf.numPages;i++){

const div = document.createElement("div");
div.className = "page";

const canvas = document.createElement("canvas");

div.appendChild(canvas);

pages.push(div);

}

pageFlip.loadFromHTML(pages);


/* Restore saved page */

let savedPage = localStorage.getItem("lastPage");

if(savedPage){

pageFlip.flip(parseInt(savedPage)-1);

renderPage(parseInt(savedPage));
renderPage(parseInt(savedPage)+1);

}else{

renderPage(1);
renderPage(2);

}

updatePageIndicator();

});


async function renderPage(pageNumber){

if(!pdf) return;

if(pageNumber < 1 || pageNumber > pdf.numPages) return;

const canvas = document.querySelectorAll("canvas")[pageNumber-1];

if(!canvas) return;

if(canvas.dataset.rendered) return;

const page = await pdf.getPage(pageNumber);

const viewport = page.getViewport({scale:1.4});

const context = canvas.getContext("2d");

canvas.width = viewport.width;
canvas.height = viewport.height;

await page.render({
canvasContext:context,
viewport:viewport
}).promise;

canvas.dataset.rendered = "true";

}


/* Page Flip Event */

pageFlip.on("flip", () => {

let page = pageFlip.getCurrentPageIndex()+1;

updatePageIndicator();

localStorage.setItem("lastPage", page);

renderPage(page);
renderPage(page+1);

});


/* Page Indicator */

function updatePageIndicator(){

let page = pageFlip.getCurrentPageIndex()+1;

pageIndicator.textContent = page;

}


/* Jump to Page */

function goToPage(){

let page = parseInt(pageInput.value);

if(!page || page < 1 || page > pdf.numPages) return;

pageFlip.flip(page-1);

renderPage(page);
renderPage(page+1);

updatePageIndicator();

localStorage.setItem("lastPage", page);

}


goButton.addEventListener("click", goToPage);


pageInput.addEventListener("keypress", (e)=>{

if(e.key === "Enter") goToPage();

});
