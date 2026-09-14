export type Review = {
  text: string;
  author: string;
  relation: string;
  rating: number;
};

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-sm">
      <div className="text-yellow-500">{"★".repeat(review.rating)}</div>
      <p className="mt-4 flex-1 text-ink/80">&ldquo;{review.text}&rdquo;</p>
      <p className="mt-6 text-sm font-semibold">
        {review.author}{" "}
        <span className="font-normal text-ink-soft">— {review.relation}</span>
      </p>
    </div>
  );
}
