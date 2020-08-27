"""config.py
Stores all configurations for this Flask app. Would be used for storing storing and access development
and production secret keys.
"""

import os

configs = {
    'development': 'server.config.DevelopmentConfig',
    'production': 'server.config.ProductionConfig',
    'testing': 'server.config.TestingConfig'
}


class Config:
    """Base configuration for the app."""


class DevelopmentConfig(Config):
    """Development configuration for the app."""


class ProductionConfig(Config):
    """Production configuration for the app."""


class TestingConfig(Config):
    """Testing configuraiton for the app."""
