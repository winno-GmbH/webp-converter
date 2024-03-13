export const metadata = {
  title: "Company was not found.",
  description: "We colud not find this company. Please, try again.",
};

function NotFound() {
  return (
    <main className="not-found">
      <h1>404 - company not found</h1>
      <p>We couldn`t find this company in our Data base.</p>
    </main>
  );
}

export default NotFound;
