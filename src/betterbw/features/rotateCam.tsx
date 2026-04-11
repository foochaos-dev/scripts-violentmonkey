function getRotation(element: HTMLElement) {
  if (!element || !element.dataset.rotation) return 0;
  return parseInt(element.dataset.rotation, 10) || 0;
}

export async function rotateCam({ id, panel }) {
  const currentRotation = getRotation(panel);
  const newRotation = (currentRotation + 90) % 360;
  panel.dataset.rotation = newRotation;

  return GM.setValue(`${id}_rotation`, newRotation);
}
