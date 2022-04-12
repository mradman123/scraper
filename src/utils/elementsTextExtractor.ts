const elementsTextExtractor = (elements: Element[]) =>
  elements.map((element: Element) => element.textContent);

export default elementsTextExtractor;
