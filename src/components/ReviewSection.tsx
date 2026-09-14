import ReviewCard, { type Review } from "./ReviewCard";

export const reviews: Review[] = [
  {
    text: "Alles was tot in de puntjes geregeld. Onze dochter heeft de hele middag met een grote glimlach rondgelopen.",
    author: "Lisa",
    relation: "moeder van Emma",
    rating: 5,
  },
  {
    text: "Wij hoefden zelf bijna niets te doen. Ideaal na een drukke werkweek!",
    author: "Sophie",
    relation: "moeder van Noor",
    rating: 5,
  },
  {
    text: "De decoratie was echt prachtig, net een echte prinsessenkamer.",
    author: "Michelle",
    relation: "moeder van Julia",
    rating: 5,
  },
  {
    text: "Rosa en Charlotte waren zo geduldig en enthousiast met de kinderen. Een aanrader.",
    author: "Tom",
    relation: "vader van Finn",
    rating: 5,
  },
];

export default function ReviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
          Dit zeggen ouders
        </h2>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <ReviewCard key={review.author} review={review} />
        ))}
      </div>
    </section>
  );
}
