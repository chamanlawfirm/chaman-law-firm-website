export const duplicateBlogRedirects: Record<string, string> = {
  "accountability-in-corporate-governance":
    "/resources/blog/accountability-in-corporate-governance-in-nigeria",
  "individual-tax-clearance-certificate":
    "/resources/blog/individual-tax-clearance-certificate-in-nigeria",
  "8-step-business-registration-process-in-lag":
    "/resources/blog/business-registration-process-in-lagosa-com",
  "what-makes-up-a-valid-employment-contract":
    "/resources/blog/what-makes-a-valid-employment-contract-in-nigeria"
};

export const duplicateBlogSlugs = new Set(Object.keys(duplicateBlogRedirects));
