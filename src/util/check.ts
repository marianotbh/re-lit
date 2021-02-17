export default function check<T>(it: unknown, checker: boolean): it is T {
  return checker
}
