from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func

Base = declarative_base()


class Region(Base):
    __tablename__ = 'regions'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    # recipes = relationship("Recipe", backref="regions")

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'id': self.id
        }


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(250), nullable=False)
    name = Column(String(250), nullable=False)
    picture = Column(String(250), nullable=False)
    # recipes = relationship("Recipe", backref="users")

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'id': self.id,
            'email': self.email,
            'picture': self.picture
        }


class Recipe(Base):
    __tablename__ = 'recipes'

    name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    description = Column(String(4000))
    difficulty = Column(Integer, nullable=False)
    duration = Column(Integer, nullable=False)
    image_url = Column(String(400), nullable=True)
    region_id = Column(Integer, ForeignKey('regions.id'))
    regions = relationship(
        'Region', backref='region_recipes', foreign_keys=[region_id])
    user_id = Column(Integer, ForeignKey('users.id'))
    users = relationship(
        'User', backref='user_recipes', foreign_keys=[user_id])
    insert_date = Column(DateTime(timezone=True), default=func.now())
    last_update = Column(DateTime(timezone=True), default=func.now())

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'description': self.description,
            'id': self.id,
            'difficulty': self.difficulty,
            'duration': self.duration,
            'image_url': self.image_url,
            'region_id': self.region_id,
            'user_id': self.user_id,
            'insert_date': self.insert_date,
            'last_update': self.last_update
        }


# engine = create_engine('sqlite:///italianrecipes.db')


# Base.metadata.create_all(engine)
