pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const container = document.getElementById("book");

const pageIndicator = document.getElementById("currentPage");
const totalIndicator = document.getElementById("totalPages");

let pdf;

const pageFlip = new St.PageFlip(container, {

width:450,
height:600,

size:"fixed",

showCover:false,

usePortrait:false,

mobileScrollSupport:false

});

pdfjsLib.getDocument("book.pdf").promise.then(async loadedPdf => {

pdf = loadedPdf;

totalIndicator.textContent = pdf.numPages;

const pages=[];

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i);

const viewport = page.getViewport({scale:1.4});

const canvas=document.createElement("canvas");

canvas.width=viewport.width;
canvas.height=viewport.height;

const context=canvas.getContext("2d");

await page.render({
canvasContext:context,
viewport:viewport
}).promise;

const div=document.createElement("div");

div.className="page";

div.appendChild(canvas);

pages.push(div);

}

pageFlip.loadFromHTML(pages);

let savedPage = localStorage.getItem("lastPage");

if(savedPage){
pageFlip.flip(parseInt(savedPage));
}

updatePageIndicator();

});

pageFlip.on("flip", () => {

updatePageIndicator();

let page = pageFlip.getCurrentPageIndex()+1;

localStorage.setItem("lastPage", page);

});

function updatePageIndicator(){

let page = pageFlip.getCurrentPageIndex()+1;

pageIndicator.textContent = page;

}

const pageInput = document.getElementById("pageInput");
const goButton = document.getElementById("goPage");

function goToPage(){

let page = parseInt(pageInput.value);

if(!page || page < 1 || page > pdf.numPages) return;

pageFlip.flip(page-1);

updatePageIndicator();

localStorage.setItem("lastPage", page);

}

goButton.addEventListener("click", goToPage);

pageInput.addEventListener("keypress", e => {

if(e.key === "Enter") goToPage();

});