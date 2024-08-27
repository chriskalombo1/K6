import PostPackages from "./Cenarios/Post-Packages.js";
import {group , sleep} from "k6";

export default function() {
  group('Endpoint Post Packages', ()  => {

    Packages();
  });
  sleep(1);
}
