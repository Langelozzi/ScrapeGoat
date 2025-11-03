#!/usr/bin/env python3
"""
Helper script to generate secure secrets for the application.

Usage:
    python scripts/generate_secrets.py
"""

import secrets
import sys


def generate_jwt_secret():
    """Generate a secure JWT secret key"""
    return secrets.token_urlsafe(32)


def generate_password():
    """Generate a random password"""
    return secrets.token_urlsafe(16)


def main():
    print("=" * 60)
    print("🔐 Secret Generator")
    print("=" * 60)
    print()
    
    print("1️⃣  JWT Secret Key (for .env file):")
    jwt_secret = generate_jwt_secret()
    print(f"   JWT_SECRET_KEY={jwt_secret}")
    print()
    
    print("2️⃣  Random Password (for testing):")
    password = generate_password()
    print(f"   {password}")
    print()
    
    print("=" * 60)
    print("📝 Next Steps:")
    print("=" * 60)
    print()
    print("1. Copy the JWT_SECRET_KEY to your .env file")
    print("2. Restart your application")
    print("3. Test the auth endpoints")
    print()
    print("Example .env entry:")
    print(f"   JWT_SECRET_KEY={jwt_secret}")
    print()
    
    # Ask if they want to generate more
    response = input("Generate another JWT secret? (y/n): ")
    if response.lower() == 'y':
        print()
        print("New JWT Secret Key:")
        print(f"   JWT_SECRET_KEY={generate_jwt_secret()}")
        print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
        sys.exit(0)

