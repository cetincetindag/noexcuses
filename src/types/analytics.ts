/**
 * Analytics data structure for tracking user progress
 */
export interface AnalyticsData {
  streaks: {
    current: {
      habits: { id: string; title: string; streak: number }[];
      tasks: { id: string; title: string; streak: number }[];
      routines: { id: string; title: string; streak: number }[];
    };
    longest: {
      daily: { id: string; title: string; streak: number; type: string } | null;
      weekly: {
        id: string;
        title: string;
        streak: number;
        type: string;
      } | null;
      monthly: {
        id: string;
        title: string;
        streak: number;
        type: string;
      } | null;
    };
    history: {
      [year: string]: {
        [month: string]: {
          [day: string]: {
            habits: { id: string; title: string; completed: number }[];
            tasks: { id: string; title: string; completed: boolean }[];
            routines: { id: string; title: string; completed: number }[];
          };
        };
      };
    };
  };
  completions: {
    daily: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
    };
    weekly: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
      mostCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
      leastCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
    };
    monthly: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
      mostCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
      leastCompleted: {
        id: string;
        title: string;
        count: number;
        type: string;
      } | null;
    };
    yearly: {
      habits: number;
      tasks: number;
      routines: number;
      total: number;
    };
  };
  categories: {
    favorite: { id: string; name: string; count: number } | null;
    usage: { [categoryId: string]: number };
  };
  lastUpdated: string;
}

/**
 * Returns the initial analytics data structure with default values
 */
export function getInitialAnalyticsData(): AnalyticsData {
  const today = new Date().toISOString();
  return {
    streaks: {
      current: {
        habits: [],
        tasks: [],
        routines: [],
      },
      longest: {
        daily: null,
        weekly: null,
        monthly: null,
      },
      history: {},
    },
    completions: {
      daily: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
      },
      weekly: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
        mostCompleted: null,
        leastCompleted: null,
      },
      monthly: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
        mostCompleted: null,
        leastCompleted: null,
      },
      yearly: {
        habits: 0,
        tasks: 0,
        routines: 0,
        total: 0,
      },
    },
    categories: {
      favorite: null,
      usage: {},
    },
    lastUpdated: today,
  };
}
