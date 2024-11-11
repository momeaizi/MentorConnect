from abc import ABC, abstractmethod


class BaseDBConnection(ABC):
    @abstractmethod
    def init_db(self, config):
        pass

    @abstractmethod
    def get_db_connection(self):
        pass

    @abstractmethod
    def release_db_connection(self, conn):
        pass

    @abstractmethod
    def close_db(self):
        pass
