
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatars, setAvatars] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setSelectedAvatar(profile.avatar_url || '');
    }
  }, [profile]);

  useEffect(() => {
    // Hard-coded list of available avatars
    const availableAvatars = [
      '/avatars/Aang.jpg',
      '/avatars/Ai-Chan.jpg',
      '/avatars/Aunt-Cass.jpg',
      '/avatars/Bodyguard.jpg',
      '/avatars/Buzz-Lightyear.png',
      '/avatars/Dash-Parr.jpg',
      '/avatars/Frozone.jpg',
      '/avatars/Gingy.jpg',
      '/avatars/Katara.jpg',
      '/avatars/Kazama.jpg',
      '/avatars/Lambu.jpg',
      '/avatars/Metroman.jpg',
      '/avatars/MrBig.jpg',
      '/avatars/Ty-Lee.jpg'
    ];
    
    setAvatars(availableAvatars);
  }, []);

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username,
          avatar_url: selectedAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={selectedAvatar} alt={fullName} />
                <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email || ''} disabled />
              <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            <Button 
              onClick={updateProfile} 
              disabled={loading}
              className="bg-expense-blue hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Choose Avatar</CardTitle>
            <CardDescription>Select an avatar for your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {avatars.map((avatar, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer p-1 rounded-md ${selectedAvatar === avatar ? 'ring-2 ring-expense-blue' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <Avatar className="w-full h-auto aspect-square">
                    <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
