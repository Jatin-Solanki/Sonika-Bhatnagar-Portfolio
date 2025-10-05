
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircle, 
  BookOpen, 
  Bookmark, 
  Mic, 
  HeartHandshake,
  Beaker,
  Eye,
  Briefcase,
  FileText,
  Award,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

const Dashboard: React.FC = () => {
  const { 
    profile, 
    researchInterests, 
    teachingInterests, 
    experiences,
    publications, 
    talks, 
    activities,
    awards,
    financialSupports
  } = useData();

  const cards = [
    { 
      title: 'Profile',
      icon: <UserCircle className="w-8 h-8 text-blue-500" />,
      description: 'Manage your personal information',
      count: 1,
      link: '/admin/profile',
      color: 'bg-blue-50'
    },
    { 
      title: 'Research Interests',
      icon: <Bookmark className="w-8 h-8 text-green-500" />,
      description: 'Add or remove research interests',
      count: researchInterests.length,
      link: '/admin/research',
      color: 'bg-green-50'
    },
    { 
      title: 'Teaching Interests',
      icon: <GraduationCap className="w-8 h-8 text-yellow-500" />,
      description: 'Add or remove teaching interests',
      count: teachingInterests.length,
      link: '/admin/teaching',
      color: 'bg-yellow-50'
    },
    { 
      title: 'Experience',
      icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
      description: 'Manage your work experience',
      count: experiences.length,
      link: '/admin/experience',
      color: 'bg-indigo-50'
    },
    { 
      title: 'Publications',
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      description: 'Manage your research publications',
      count: publications.length,
      link: '/admin/publications',
      color: 'bg-purple-50'
    },
    { 
      title: 'Invited Talks',
      icon: <Mic className="w-8 h-8 text-red-500" />,
      description: 'Manage your presentations',
      count: talks.length,
      link: '/admin/talks',
      color: 'bg-red-50'
    },
    { 
      title: 'Volunteer Activities',
      icon: <HeartHandshake className="w-8 h-8 text-pink-500" />,
      description: 'Manage your service activities',
      count: activities.length,
      link: '/admin/activities',
      color: 'bg-pink-50'
    },
    { 
      title: 'Awards',
      icon: <Award className="w-8 h-8 text-orange-500" />,
      description: 'Manage your awards and recognitions',
      count: awards.length,
      link: '/admin/awards',
      color: 'bg-orange-50'
    },
    { 
      title: 'Financial Support',
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      description: 'Manage funding and grants',
      count: financialSupports.length,
      link: '/admin/financial-support',
      color: 'bg-emerald-50'
    },
    { 
      title: 'Lab Information',
      icon: <Beaker className="w-8 h-8 text-cyan-500" />,
      description: 'Manage laboratory details',
      count: 1,
      link: '/admin/lab',
      color: 'bg-cyan-50'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your professor portfolio</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            View Public Site
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Welcome, {profile?.name || 'Professor'}!</CardTitle>
          <CardDescription>
            Use this dashboard to manage your portfolio content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your portfolio is publicly visible and can be edited through this admin interface.</p>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className={`${card.color} rounded-t-lg px-4 py-3 flex flex-row items-center justify-between`}>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold">{card.count}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {card.count === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
