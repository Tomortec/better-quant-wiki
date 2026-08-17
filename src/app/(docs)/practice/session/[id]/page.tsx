import { QuizRunner } from "@/components/practice/quiz-runner";

type Props = { params: Promise<{ id: string }> };

export const metadata = {
  title: "练习进行中",
  robots: { index: false, follow: false },
};

export default async function SessionPage({ params }: Props) {
  const { id } = await params;
  return <QuizRunner sessionId={id} />;
}
