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
