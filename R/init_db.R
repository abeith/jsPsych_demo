con <- DBI::dbConnect(
              RMariaDB::MariaDB(),
              host = '127.0.0.1',
              port = '3306',
              user = 'root',
              password = 'example'
            )

DBI::dbSendStatement(con, 'CREATE DATABASE jsPsych;')

DBI::dbDisconnect(con)
