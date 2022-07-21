import React, { useEffect } from "react";

export default function Scroll() {
  useEffect(function mount() {
    function onScroll() {
      console.log("");
    }

    window.addEventListener("scroll", onScroll);

    return function unMount() {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}