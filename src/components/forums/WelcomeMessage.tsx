interface WelcomeMessageProps {
  user: any;
}

export const WelcomeMessage = ({ user }: WelcomeMessageProps) => {
  if (!user) return null;
  
  return (
    <span className="text-purple-300">
      Welcome back, {user.email?.split('@')[0]}!
    </span>
  );
};