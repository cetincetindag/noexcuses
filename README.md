# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Testing

This project uses Jest and React Testing Library for unit testing. The tests are organized in the following structure:

- `src/__tests__/components/`: Tests for React components
- `src/__tests__/services/`: Tests for service functions
- `src/__tests__/db/`: Tests for database operations
- `src/__tests__/helpers/`: Test helpers and mocks

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Structure

1. **Component Tests**: Test the rendering and behavior of React components
2. **Service Tests**: Test the business logic in service functions
3. **Database Tests**: Test database operations using mocked Prisma client

### Adding New Tests

When adding new tests, follow these patterns:

1. For components:

   - Test rendering
   - Test user interactions
   - Test state changes

2. For services:

   - Test successful operations
   - Test error handling
   - Mock dependencies

3. For database operations:
   - Mock Prisma client responses
   - Test CRUD operations
   - Test error conditions

### Mocking

The application uses several mocks:

- `mockDb.ts`: Mocks the Prisma client for database tests
- Jest mocks for external dependencies like Clerk authentication
- Component mocks for complex UI components
