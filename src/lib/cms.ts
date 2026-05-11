import { blogPosts } from "@/data/blog";
import { jobOpenings } from "@/data/jobs";
import { properties } from "@/data/properties";
import { services } from "@/data/services";

export async function getProperties() {
  return properties;
}

export async function getFeaturedProperties() {
  return properties.filter((property) => property.featured);
}

export async function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug) || null;
}

export async function getPropertiesByStatus(status: string) {
  const normalized = status.toLowerCase();
  return properties.filter((property) => property.status.toLowerCase().replace(" ", "-") === normalized);
}

export async function getServices() {
  return services;
}

export async function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug) || null;
}

export async function getBlogPosts() {
  return blogPosts;
}

export async function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) || null;
}

export async function getJobOpenings() {
  return jobOpenings;
}
