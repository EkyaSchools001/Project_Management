import { useAuth } from "@/hooks/useAuth";
import { TeacherPortfolio } from "./TeacherPortfolio";
import { PortfolioDirectory } from "./PortfolioDirectory";

export function PortfolioIndex() {
  const { user } = useAuth();
  
  // Teachers should see their own portfolio by default.
  if (user?.role?.toLowerCase() === 'teacher') {
    return <TeacherPortfolio />;
  }

  // Everyone else (Leaders, Admins) sees the directory first.
  return <PortfolioDirectory />;
}
