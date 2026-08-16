import { permanentRedirect } from "next/navigation";

export default function NotesIndex() {
  permanentRedirect("/notes/probability");
}
