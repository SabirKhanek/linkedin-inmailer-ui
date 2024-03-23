export const sortCookie = (cookie: string) => {
  // Split the cookie string by ';'
  const cookies = cookie.split(";");
  // Sort the cookies alphabetically
  const sortedCookies = cookies.map((cookie) => cookie.trim()).sort();
  // Join the sorted cookies back into a string separated by ';'
  return sortedCookies.join("; ");
};
export function parseCookie(cookieString: string) {
  try {
    const cookieObject: any = {};
    const cookiePairs = cookieString.split(";");

    for (const pair of cookiePairs) {
      const [key, value] = pair.trim().split("=");
      cookieObject[key] = decodeURIComponent(value);
    }

    return cookieObject;
  } catch (err) {
    return {} as any;
  }
}
