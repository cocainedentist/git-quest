import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import ContributionGrass from "../components/ContributionGrass";
import Timer from "../components/Timer";
import QuestBoard from "../components/QuestBoard";
import ActivityLog from "../components/ActivityLog";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-base)" }}
    >
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
        <UserProfile />
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
          <div className="flex flex-col gap-4">
            <ContributionGrass />
            <Timer />
          </div>
          <QuestBoard />
        </div>
        <ActivityLog />
      </main>
    </div>
  );
}
