// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GoogleDoc {
  export function appendToGoogleDoc(
    documentUrl: string,
    userData: Map<string, string[]>,
    link: string
  ): void {
    const doc = DocumentApp.openByUrl(documentUrl);
    const body = doc.getBody();

    // Locate the "Weekly notes" header
    const header = findHeader(body, "Weekly notes");
    if (!header) {
      console.log('Header "Weekly notes" not found.');
      return;
    }

    // Get the index of the header to insert new content just below it
    const index = header.getParent().getChildIndex(header);

    // Append a section for today's date just below the header
    const dateSection = body.insertParagraph(
      index + 1,
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "MMM dd, yyyy"
      )
    );
    dateSection.setHeading(DocumentApp.ParagraphHeading.HEADING2);

    // Append the status updates header with the link
    const updatesHeader = body.insertParagraph(
      index + 2,
      "Status updates from thread"
    );
    updatesHeader.setHeading(DocumentApp.ParagraphHeading.HEADING3);
    updatesHeader.setLinkUrl(link);

    // Start appending user names and messages
    let currentIndex = index + 3;

    userData.forEach((messages, user) => {
      // Insert the user name as a bold paragraph
      const userParagraph = body.insertParagraph(currentIndex, user);
      userParagraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
      userParagraph.editAsText().setBold(true);
      currentIndex++;

      // Insert each message as a regular paragraph under the user name
      messages.forEach((message) => {
        const messageParagraph = body.insertParagraph(currentIndex, message);
        messageParagraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
        currentIndex++;
      });

      // Insert an empty paragraph for a newline after each person
      const newlineParagraph = body.insertParagraph(currentIndex, "");
      newlineParagraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
      currentIndex++;
    });

    // Save changes
    doc.saveAndClose();
  }

  function findHeader(
    body: GoogleAppsScript.Document.Body,
    searchText: string
  ): GoogleAppsScript.Document.Paragraph | null {
    const numChildren = body.getNumChildren();
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const paragraph = child.asParagraph();
        if (
          paragraph.getText() === searchText &&
          paragraph.getHeading() === DocumentApp.ParagraphHeading.HEADING1
        ) {
          return paragraph;
        }
      }
    }
    return null;
  }
}
