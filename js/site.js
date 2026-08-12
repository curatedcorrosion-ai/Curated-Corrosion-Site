/* =====================================================
   CURATED CORROSION
   Gallery / Archive Interface
===================================================== */

let specimens = [];
let activeFilter = "all";


const galleryGrid =
  document.getElementById("galleryGrid");

const gallerySearch =
  document.getElementById("gallerySearch");

const galleryEmpty =
  document.getElementById("galleryEmpty");



/* =====================================================
   LOAD ARCHIVE DATA
===================================================== */

async function loadGallery() {

  if (!galleryGrid) return;

  try {

    const response =
      await fetch("data/specimens.json");

    if (!response.ok) {
      throw new Error(
        "Unable to load specimen archive."
      );
    }

    specimens =
      await response.json();

    renderGallery();

  }

  catch (error) {

    console.error(error);

    galleryGrid.innerHTML = `
      <div class="gallery-error">
        The specimen archive could not be loaded.
      </div>
    `;

  }

}



/* =====================================================
   RENDER GALLERY
===================================================== */

function renderGallery() {

  if (!galleryGrid) return;


  const searchTerm =
    gallerySearch
      ? gallerySearch.value
          .toLowerCase()
          .trim()
      : "";


  const filtered =
    specimens.filter(specimen => {

      const categoryMatch =
        activeFilter === "all" ||
        specimen.category === activeFilter;


      const searchableText = [

        specimen.specimenId,
        specimen.category,
        specimen.name,
        specimen.typeFamily,
        specimen.era,
        specimen.manufacturer,
        specimen.markings,
        specimen.provenance,
        specimen.condition,
        specimen.characterization,
        specimen.observation,
        specimen.history

      ]
      .join(" ")
      .toLowerCase();


      const searchMatch =
        searchableText.includes(searchTerm);


      return (
        categoryMatch &&
        searchMatch
      );

    });


  galleryGrid.innerHTML = "";


  if (filtered.length === 0) {

    galleryEmpty.hidden = false;

    return;

  }


  galleryEmpty.hidden = true;


  filtered.forEach(specimen => {

    const card =
      document.createElement("article");


    card.className =
      "gallery-card";


    card.innerHTML = `

      <div class="gallery-card-image">

        ${
          specimen.image

          ? `
            <img
              src="${specimen.image}"
              alt="${specimen.name}">
          `

          : `
            <div class="specimen-placeholder">
              <span>CC</span>
              SPECIMEN
            </div>
          `
        }

      </div>


      <div class="gallery-card-body">

        <div class="gallery-card-id">
          ${specimen.specimenId}
        </div>


        <h2>
          ${specimen.name}
        </h2>


        <p class="gallery-card-family">
          ${specimen.typeFamily}
        </p>


        <div class="gallery-card-meta">

          <span>
            ${specimen.manufacturer}
          </span>

          <span>
            ${specimen.era}
          </span>

        </div>


        <button
          class="record-button"
          type="button">

          VIEW SPECIMEN RECORD →

        </button>

      </div>
    `;


    card
      .querySelector(".record-button")
      .addEventListener(
        "click",
        () => openSpecimen(specimen)
      );


    galleryGrid.appendChild(card);

  });

}



/* =====================================================
   SEARCH
===================================================== */

if (gallerySearch) {

  gallerySearch.addEventListener(
    "input",
    renderGallery
  );

}



/* =====================================================
   FILTERS
===================================================== */

document
  .querySelectorAll(".gallery-filter")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        activeFilter =
          button.dataset.filter;


        document
          .querySelectorAll(
            ".gallery-filter"
          )
          .forEach(filter => {

            filter.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        renderGallery();

      }
    );

  });



/* =====================================================
   SPECIMEN MODAL
===================================================== */

const specimenModal =
  document.getElementById(
    "specimenModal"
  );


const modalClose =
  document.getElementById(
    "modalClose"
  );


function setModalText(
  elementId,
  text
) {

  const element =
    document.getElementById(
      elementId
    );


  if (element) {

    element.textContent =
      text || "Not yet documented.";

  }

function loadSpecimenPhotos(specimen) {
  const mainImage = document.getElementById("modalMainImage");
  const photoStrip = document.getElementById("modalPhotoStrip");
  const prevButton = document.getElementById("modalPhotoPrev");
  const nextButton = document.getElementById("modalPhotoNext");

  if (!mainImage || !photoStrip) return;

  const photos =
    Array.isArray(specimen.images) && specimen.images.length
      ? specimen.images
      : specimen.image
        ? [specimen.image]
        : [];

  let currentIndex = 0;

  function showPhoto(index) {
    if (!photos.length) return;

    currentIndex = (index + photos.length) % photos.length;

    mainImage.src = photos[currentIndex];
    mainImage.alt =
      `${specimen.name} — photograph ${currentIndex + 1} of ${photos.length}`;

    photoStrip
      .querySelectorAll("button")
      .forEach((button, buttonIndex) => {
        button.classList.toggle(
          "active",
          buttonIndex === currentIndex
        );
      });
  }

  photoStrip.innerHTML = "";

  photos.forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-photo-thumbnail";

    const thumbnail = document.createElement("img");
    thumbnail.src = src;
    thumbnail.alt =
      `${specimen.name} thumbnail ${index + 1}`;

    button.appendChild(thumbnail);
    button.onclick = () => showPhoto(index);

    photoStrip.appendChild(button);
  });

  if (prevButton) {
    prevButton.onclick = () => showPhoto(currentIndex - 1);
  }

  if (nextButton) {
    nextButton.onclick = () => showPhoto(currentIndex + 1);
  }

  if (photos.length) {
    showPhoto(0);
  } else {
    mainImage.removeAttribute("src");
    mainImage.alt = "";
  }

  if (prevButton) {
    prevButton.hidden = photos.length <= 1;
  }

  if (nextButton) {
    nextButton.hidden = photos.length <= 1;
  }
}



function openSpecimen(specimen) {

  if (!specimenModal) return;


  setModalText(
    "modalSpecimenId",
    specimen.specimenId
  );


  setModalText(
    "modalTitle",
    specimen.name
  );


  setModalText(
    "modalType",
    specimen.typeFamily
  );


  setModalText(
    "modalEra",
    specimen.era
  );


  setModalText(
    "modalManufacturer",
    specimen.manufacturer
  );


  setModalText(
    "modalMarkings",
    specimen.markings
  );


  setModalText(
    "modalProvenance",
    specimen.provenance
  );


  setModalText(
    "modalCondition",
    specimen.condition
  );


  setModalText(
    "modalCharacterization",
    specimen.characterization
  );


  setModalText(
    "modalObservation",
    specimen.observation
  );


  setModalText(
    "modalHistory",
    specimen.history
  );

loadSpecimenPhotos(specimen);

  specimenModal.classList.add(
    "open"
  );


  specimenModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}



function closeSpecimen() {

  if (!specimenModal) return;


  specimenModal.classList.remove(
    "open"
  );


  specimenModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}



if (modalClose) {

  modalClose.addEventListener(
    "click",
    closeSpecimen
  );

}


const modalOverlay =
  document.querySelector(
    ".specimen-modal-overlay"
  );


if (modalOverlay) {

  modalOverlay.addEventListener(
    "click",
    closeSpecimen
  );

}


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeSpecimen();

    }

  }
);



/* =====================================================
   INITIALIZE
===================================================== */

loadGallery();
