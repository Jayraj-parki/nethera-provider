import CancelledTickets from "@/components/cancelled_page/CancelledTickets";


export default function HomePage() {
  return (
    <>
      <main className="container rows mx-auto col-12 col-lg-10 mt-lg-4 mt-2">
        <CancelledTickets/>
      </main>
    </>
  );
}
