import { useAuth } from "@pdi/hooks/useAuth";
import { TeacherPortfolio } from "./TeacherPortfolio";
import { PortfolioDirectory } from "./PortfolioDirectory";

export function PortfolioIndex() {
  const { user } = useAuth();
  console.log("PortfolioIndex: current user role:", user?.role);
  
  // Teachers should see their own portfolio by default.
  if (user?.role?.toUpperCase() === 'TEACHER') {
    return <TeacherPortfolio />;
  }

  // Everyone else (Leaders, Admins, Management, etc.) sees the directory first.
  return <PortfolioDirectory />;
}
