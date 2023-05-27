console.log('Hello from contents.js!');

if (document instanceof Document) {
  detect();
}

function detect() {
  let delay = 1000;
  let detectRemainingTries = 10;

  setTimeout(() => {
    runDetect();
  }, 100);

  function runDetect() {
    // Method 0: does URL includes "*/docs/*"? <check manifest.json contents_script matches>
    // ** edge1: MDN Docs also includes */docs/* on their URLs. but its not a restDocs.

    // Method 1: do document metas have some content with Asciidoctor?
    // reason - restDocs use Asciidoctor to transfile asciidoc to html file.
    // ** edge1 clear
    const headMeta = Array.from(document.head.getElementsByTagName('meta'));
    const isContentIncludesAsciidoctor = headMeta.some((val) =>
      val.content.includes('Asciidoctor')
    );

    // docsDetected: does "restDocs" has been detected?
    // TODO: need more unique properties of restDocs!
    const docsDetected = isContentIncludesAsciidoctor; // &&;

    if (!docsDetected) {
      retryDetect();
      return;
    }

    chrome.runtime.sendMessage({
      docsDetected: true,
    });
    insertObserverOnTargetElementList();
  }

  // retry if detecting fails
  function retryDetect() {
    if (detectRemainingTries > 0) {
      detectRemainingTries--;
      setTimeout(() => {
        runDetect();
      }, delay);
      delay *= 5;
    }
  }
}

// List with sections actually observed by the viewport
let sectionIdList = [];

function insertObserverOnTargetElementList() {
  let target = '.sect2';
  // step 1 : set observerCallback
  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      handleIntersectTargetSection(entry);
    });
  }

  // step 2 : create IntersectionObserver with Web API
  var observer = new IntersectionObserver(observerCallback, {
    threshold: 0.01,
  });

  // step 3 : make observer to observe every target Elements
  document.querySelectorAll(target).forEach((i) => {
    if (i) {
      observer.observe(i);
    }
  });
}

// in restDocs. first children of section2 is <h3> Element with detail id(API title or someting)
function getTargetId(entry) {
  return entry.target.children[0].id;
}

// in restDocs. there are 2 navigation items per one id.
// the first one([0]) is the <a> tag on TOC and the other one is <h3> tag itself.
function getElementOnTocById(targetId) {
  return document.querySelectorAll(`[href="#${targetId}"]`)[0].parentElement;
}

// update className 'activated' on TOC element to show or hide some background
function updateElementOnTocById(targetId, activated = true) {
  const elementOnToc = getElementOnTocById(targetId);

  // remove to prepare some observer frame drop Issue
  elementOnToc.classList.remove('activated');
  if (activated) {
    elementOnToc.classList.add('activated');
  }
}

// update List with sections actually observed by the viewport
function updateSectionIdList(targetId, add = true) {
  if (add) {
    sectionIdList.push(targetId);
    return;
  }
  sectionIdList = sectionIdList.filter((id) => id !== targetId);
}

// observerCallback "isIntersecting" handler
function handleIntersectTargetSection(entry) {
  const targetId = getTargetId(entry);
  updateSectionIdList(targetId, entry.isIntersecting);
  updateElementOnTocById(targetId, entry.isIntersecting);
}
