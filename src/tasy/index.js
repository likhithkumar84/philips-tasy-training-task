export default function tasy() {
  const wMyComponentElement = document.querySelector("#wMyComponent");

  if (wMyComponentElement && wMyComponentElement.handler)
    console.log("my component handler is ", wMyComponentElement.handler);
}
