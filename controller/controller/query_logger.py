from controller.settings import LOG_FILE
from datetime import datetime
from pathlib import Path 

def log_query(query: str, log_file: str = LOG_FILE):
    """Logs saved in utc. Django query format mostly retained.
    I am aware this would not execute in SQL as is due to quotation marks but I merely wanted it to be human-readable"""
    
    with open(f'{Path(__file__).parent.parent}\{log_file}','a') as log:
        log.write(f'''{datetime.utcnow()} '{query.replace('api_','').replace('"address".','')}' \n''')