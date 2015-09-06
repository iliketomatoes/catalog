import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()


class Region(Base):
    __tablename__ = 'regions'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'id': self.id,
        }


class Recipe(Base):
    __tablename__ = 'recipes'

    name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    description = Column(String(4000))
    difficulty = Column(String(8))
    duration = Column(Integer)
    region_id = Column(Integer, ForeignKey('regions.id'))
    region = relationship(Region)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'description': self.description,
            'id': self.id,
            'difficulty': self.difficulty,
            'duration': self.duration,
        }


engine = create_engine('sqlite:///italianrecipes.db')


Base.metadata.create_all(engine)
