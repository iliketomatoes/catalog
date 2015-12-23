from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Region, Recipe

engine = create_engine('sqlite:////var/www/catalog/catalog/italianrecipes.db')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.create_all(engine)

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()

REGIONS = [
    'Valle d\'Aosta',
    'Piemonte',
    'Liguria',
    'Lombardia',
    'Emilia Romagna',
    'Trentino Alto-Adige',
    'Veneto',
    'Friuli Venezia Giulia',
    'Toscana',
    'Umbria',
    'Marche',
    'Lazio',
    'Abruzzo',
    'Molise',
    'Sardegna',
    'Campania',
    'Basilicata',
    'Puglia',
    'Calabria',
    'Sicilia'
]


def addRegions():
    for region in REGIONS:
        session.add(Region(name=region))
    session.commit()

if __name__ == '__main__':
    addRegions()
