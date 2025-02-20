import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
    text: string;
    link: string;
}

const BackButton = ({ text, link }: BackButtonProps) => {
  return (
    <Link href={ link } className="text-black hover:underline flex items-center gap-1 font-bold mb-5"  >
      <ArrowLeftCircle size={25} /> { text }
    </Link>
  );
}

export default BackButton;