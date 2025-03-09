import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { BookOpen, Video, Brain, Heart, Activity, Pill, AlertTriangle } from "lucide-react"

interface Resource {
  title: string;
  type: string;
  duration: string;
  description: string;
  action: {
    label: string;
    url: string;
  };
}

interface Wellness {
  lifestyle: Resource[];
  exercises: Resource[];
  mindfulness: Resource[];
  natural_remedies: Resource[];
}

interface Recommendations {
  articles: Resource[];
  videos: Resource[];
  wellness: Wellness;
}

export default function Recommendations({ recommendations }: { recommendations?: Recommendations }) {
  if (!recommendations) {
    return null;
  }

  const { articles, videos, wellness } = recommendations;

  return (
    <div className="space-y-6">
      {articles && articles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Educational Resources</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{article.title}</span>
                      </div>
                      <Badge variant="secondary">{article.duration}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {article.description}
                      </p>
                      <Button variant="link" className="p-0" asChild>
                        <a href={article.action.url} target="_blank" rel="noopener noreferrer">
                          {article.action.label}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {videos && videos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Video Resources</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((video, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span className="font-medium">{video.title}</span>
                      </div>
                      <Badge variant="secondary">{video.duration}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {video.description}
                      </p>
                      <Button variant="link" className="p-0" asChild>
                        <a href={video.action.url} target="_blank" rel="noopener noreferrer">
                          {video.action.label}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {wellness && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lifestyle Changes</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {wellness.lifestyle.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <Badge variant="secondary">{item.duration}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <Button variant="link" className="p-0" asChild>
                          <a href={item.action.url} target="_blank" rel="noopener noreferrer">
                            {item.action.label}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercise Recommendations</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {wellness.exercises.map((exercise, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="font-medium">{exercise.title}</span>
                        </div>
                        <Badge variant="secondary">{exercise.duration}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {exercise.description}
                        </p>
                        <Button variant="link" className="p-0" asChild>
                          <a href={exercise.action.url} target="_blank" rel="noopener noreferrer">
                            {exercise.action.label}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mindfulness Practices</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {wellness.mindfulness.map((practice, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="font-medium">{practice.title}</span>
                        </div>
                        <Badge variant="secondary">{practice.duration}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {practice.description}
                        </p>
                        <Button variant="link" className="p-0" asChild>
                          <a href={practice.action.url} target="_blank" rel="noopener noreferrer">
                            {practice.action.label}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Natural Remedies</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {wellness.natural_remedies.map((remedy, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-medium">{remedy.title}</span>
                        </div>
                        <Badge variant="secondary">{remedy.duration}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {remedy.description}
                        </p>
                        <Button variant="link" className="p-0" asChild>
                          <a href={remedy.action.url} target="_blank" rel="noopener noreferrer">
                            {remedy.action.label}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}