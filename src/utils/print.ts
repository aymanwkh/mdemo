export default function print(html: string, title: string) {
  let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
  if (!mywindow) return
  mywindow.document.write(`<html dir="rtl"><head><title>${title}</title>`);
  mywindow.document.write('</head><body >');
  mywindow.document.write(html);
  mywindow.document.write('</body></html>');

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();
}
