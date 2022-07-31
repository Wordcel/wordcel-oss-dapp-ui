export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getFirstName = (fullName?: string) => {
  return fullName?.split(' ')[0];
}