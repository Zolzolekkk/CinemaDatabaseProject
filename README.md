## **Skład grupy:** Filip Dziurdzia, Zofia Lenart, Jakub Barber

### **Technologia:** MongoDB, Node.js, React

### **Temat:** Lokalne Kino

**Zofia Lenart**: zlenart@student.agh.edu.pl

**Jakub Barber:** jakubbarber@student.agh.edu.pl

**Filip Dziurdzia:** fdziurdzia@student.agh.edu.pl

# Baza Danych

Baza danych składa się z 5 kolekcji: Movies, Programme, Users, Rooms oraz Prices.

## Movies

Kolekcja **Movies** zawiera podstawowe informacje o filmach puszczanych w naszym kinie. Wszystkie dane zostały pobrane za pomocą IMDB API. Przykładowy dokument w kolekcji Movies.

![Movies Document](Documentation/movies-doc.png)

## Programme

Kolekcja **Programme** jest najbardziej rozbudowaną strukturą w naszej bazie. Każdy dokument reprezentuję repertuar na dany tydzień. Zawiera on początek i koniec danego tygodnia oraz obiekt **days** składający się z 7 dni tygodnia. Każdy dzień tygodnia zawiera tablicę **seansów**. Każdy **seans** zawiera podstawowe dane, takie jak **movieid** wskazujący na puszczany wtedy film, początek i koniec seansu, macierz miejsc sygnalizujacych dostępność miejsc oraz tablice biletów kupionych na dany seans.

<!-- ss do poprawy -->

![Programme Document](Documentation/programme-doc.png)

## Users

Kolekcja **Users** zawiera informację o użytkownikach, zarówno zarejestrowanych na stronie naszego kina, jak tych co kupowali bilety jedynie przy użyciu emaila (bez rejestracji). Każdy dokument zawiera podstawowe informacje o użytkowniku takie jak: imię, nazwisko, e-mail, zahashowane hasło, rola oraz tablica biletów. **Bilet** trzymany w userze jest identyczny jak ten trzymany w seansie. Składa się on z kluczy obcych do usera oraz seansu, ceny, typu, miejsca oraz zawiera podstawowe informacje o filmie na który został on zakupiony.

![Users Document](Documentation/user-doc.png)

## Rooms

Kolekcja **Rooms** zawiera informacje o salach dostępnych w naszym kinie. Każda sala jest osobnym dokumentem zawierającym numer sali, liczbę rzędów oraz liczbę miejsc w rzędzie.

![Rooms Document](Documentation/room-doc.png)

## Prices

W kolekcji **Prices** trzymamy ceny biletów normalnych i ulgowych, zarówno dla filmów 2D jak i 3D. Dodatkowo mamy informacje od kiedy obowiązują dane ceny oraz do kiedy były używane. Ceny aktualne posiadają **null** w polu **endtime**

![Prices Document](Documentation/prices-doc.png)

# Backend

Po stronie backendu zrealizowaliśmy podstawowe funkcje potrzebne do obsługi aplikacji kina. Poniżej zamieściliśmy przykładowe funkcjonalności, które zrealizowaliśmy.

## Widoki

**Widok biletów użytkownika**\

```javascript
const getUserTickets = async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  try {
    const user = await User.findById(
      new ObjectId(req.body.userid)
    );
    if (!user) {
      throw new Error("User of given Id does not exist");
    }
    res.status(200).json({ tickets: user.tickets });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**Widok zwracająca program obowiązujący dla danej daty z uzupełnionymi referencjami na movieid oraz room**\
Po upewnieniu się, że program istnieje wykonujemy zapytanie i uzupełniamy referencje odpowiednimi obiektami

```javascript
const getSeancesOfTheWeek = async (req, res) => {
  const date = new Date(req.body.date);
  try {
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date },
    });
    await Programme.populateQuery(programme);
    if (!programme) {
      throw new Error("Programme doesn't exist");
    }
    res.status(200).json({ programme: programme });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**Widok repertuaru na x zadanych tygodni**\
Widok repertuaru na x następnych tygodni (x ustalone po stornie backendu).
W zwracanych obiektach referencje są zastąpione obiekatmi odpowiedniego filmu i pokoju, więc aplikacja dostaje pełen zestaw danych o danym repertuarze.

```javascript
const getProgrammeForXWeeksAheadPopulated = async (
  req,
  res
) => {
  const date = new Date();
  try {
    const programmes = await Programme.find({
      endtime: { $gte: date },
    })
      .sort({ endtime: 1 })
      .limit(x);
    if (programmes.length === 0) {
      throw new Error("Programme doesn't exist");
    }
    await Programme.populatePogrammeArray(programmes);
    res.status(200).json({ programmes: programmes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**Widok listy pokojów w naszym kinie**\
Zapytanie zwraca listę sal kinowych w naszym kinie

```javascript
const getRooms = async (req, res) => {
  try {
    const datatoSave = await Room.find({});
    res.status(200).json({ rooms: datatoSave });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

## Procedury

Podczas implementacji korzystaliśmy z biblioteki mongoose do modelowania warunków integralności/spójności tworzonych dokumentów.
Poza walidacją mongoose dostarczył nam wiele funkcjonalności upraszczających operacje na bazie mongodb oraz funkcjonalności implementacyjne jak na przykład
modele oraz metody statyczne na modelach.

**Procedura dodania nowego seansu**\
Upewniamy się o istnieniu programu w danym przedziale czasowym, sprawdzamy czy pokój nie jest okupowany danego dnia o
konkretnych godzinach oraz czy istnieje movie o podanym id

Funckja pomocnicza - trigger sprawdzający czy pokój jest wolny:

```javascript
const checkPotentialOverlap = (
  start1,
  end1,
  start2,
  end2
) => {
  return (
    (start1 <= start2 && end1 >= end2) ||
    (start1 >= start2 && start1 <= end2) ||
    (end1 >= start2 && end1 <= end2)
  );
};
```

```javascript
const addSeanse = async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const date = new Date(req.body.date);
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date },
    });
    if (!programme) {
      throw new Error("Programme doesn't exist");
    }
    const day = getDayName(date.getUTCDay());
    const foundRoom = await Room.findById(
      new ObjectId(req.body.room)
    );
    console.log(`FoundRoom: ${foundRoom}`);
    if (!foundRoom) {
      throw new Error("This room doesn't exist");
    }
    const starttime = new Date(req.body.starttime);
    const endtime = new Date(req.body.endtime);

    const dailySeanses = programme.days[day].seanses;
    const existsRoomCollision = dailySeanses.find(
      (seanse) =>
        req.body.room === seanse.room.toString() &&
        checkPotentialOverlap(
          starttime,
          endtime,
          new Date(seanse.starttime),
          new Date(seanse.endtime)
        )
    );

    if (existsRoomCollision) {
      throw new Error(
        "Provided Room is occupied at the same time"
      );
    }

    // checking if movie exists
    const movie = await Movie.findById(
      new ObjectId(req.body.movieid)
    );

    if (!movie) {
      throw new Error("Movie doesn't exist");
    }

    const seats = createEmptyRoom(
      foundRoom.rows,
      foundRoom.cols
    );
    const seanse = {
      movieid: new ObjectId(req.body.movieid),
      "3d": req.body.is3d,
      room: new ObjectId(req.body.room),
      starttime: starttime,
      endtime: endtime,
      seats: seats,
      tickets: [],
    };
    programme.days[day].seanses.push(seanse);
    const updatedProgramme = await programme.save();
    res.json({
      programme: updatedProgramme,
      seanse: seanse,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};
```

**Procedura dodania nowego programu**\
Upewniamy się, że program zaczyna się w poniedziałek oraz kończy w niedziele (zerujemy godziny w datach żeby objąć cały tydzień),
upewniając się wcześniej, że w danym przedziale czasowym nie ma jeszce obowiązującego programu

```javascript
const addProgramme = async (req, res) => {
  const starttime = new Date(req.body.starttime);
  const endtime = new Date(req.body.endtime);
  starttime.setUTCHours(0, 0, 0, 0);
  endtime.setUTCHours(23, 59, 59, 999);
  try {
    if (
      getDayName(starttime.getUTCDay()) !== "monday" ||
      getDayName(endtime.getUTCDay()) !== "sunday"
    ) {
      throw new Error(
        "Programme must take whole week (from monday to sunday) "
      );
    }
    const programmeFound = await Programme.findOne({
      $expr: {
        $and: [
          {
            $gte: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$starttime",
                },
              },
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: starttime,
                },
              },
            ],
          },
          {
            $lte: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$endtime",
                },
              },
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: endtime,
                },
              },
            ],
          },
        ],
      },
    });
    if (programmeFound) {
      throw new Error(
        `Program in given timestamps already exists and has id: ${programmeFound._id}`
      );
    }
    const programme = new Programme({
      starttime: starttime,
      endtime: endtime,
      days: {
        monday: { seanses: [] },
        tuesday: { seanses: [] },
        wednesday: { seanses: [] },
        thursday: { seanses: [] },
        friday: { seanses: [] },
        saturday: { seanses: [] },
        sunday: { seanses: [] },
      },
    });
    const savedProgramme = await programme.save();
    res.json({ programme: savedProgramme });
  } catch (err) {
    res.json({ message: err.message });
  }
};
```

**Rejestracja nowego użytkownika**\
Upewniamy się, czy dany email nie figuruje już w naszej bazie, sprawdzamy, czy dostaliśmy wszystkie dane potrzebne
do rejestracji, jeśli wszystko się zgadza dodajemy nowego użytkwnia o bazy.

```javascript
const registerUser = async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length !== 0) {
      throw new Error(
        "User with given email already exists"
      );
    }
    if (
      !req.body.password ||
      !req.body.name ||
      !req.body.surname
    ) {
      throw new Error(
        "Not full data about new client has been provided"
      );
    }
    const hashedPassword = await generateHash(
      req.body.password
    );
    const data = new User({
      ...req.body,
      password: hashedPassword,
      tickets: [],
    });

    const datatoSave = await data.save();
    res.status(200).json({
      user: {
        id: datatoSave._id,
        email: datatoSave.email,
        name: datatoSave.name,
        surname: datatoSave.surname,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**Procedura logowania użytkownika**\
Kontrola poprawności zahashowanego hasła i podanego przy logowaniu emaila oraz wysłanie informacji zwrotnej do frontendu

```javascript
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error(
      "Email or password hasnt been specified"
    );
  }
  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      throw new Error("User of given email doesnt exist");
    }
    const passwordsMatch = await comparePasswords(
      password,
      foundUser.password
    );
    if (!passwordsMatch) {
      throw new Error("Incorrect password for given email");
    }
    res.status(200).json({
      user: {
        email: foundUser.email,
        id: foundUser._id,
        name: foundUser.name,
        surname: foundUser.surname,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**Dodawanie pokoju**\
Dodawanie pokoju o zadanych parametrach (rows, cols) i numerze, po uwczesnym upewnieniu się, że w naszym kinie nie ma już sali o takim numerze

```javascript
const addRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      number: req.body.number,
    });
    if (room) {
      throw new Error(
        "Room of given number already exists"
      );
    }
    const data = new Room(req.body);
    const datatoSave = await data.save();
    res.status(200).json({ room: datatoSave });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

**Procedura dodania biletu**\
Jest to dosyć duża obszernościwo prcedura, więc zaprezentujemy tutaj jej urywki.

W celu zwracania odpowiedniej odpowiedzi do frontendu zamiast movieid/roomid w danym miejscu dodajemy cały model dzięki populate.
Stworzyliśmy naszą statyczną metodę na modelu, która używając populate podmienia id na dane w każdym seansie.

```javascript
programmeSchema.statics.populateQuery = async function (
  programme
) {
  for (const day of dayNames) {
    await this.populate(programme, {
      path: `days.${day}.seanses`,
      model: "SingleSeance",
      populate: [
        {
          path: "movieid",
          model: "Movie",
        },
        {
          path: "room",
          model: "Room",
        },
      ],
    });
  }
  return programme;
};
```

Aby dodać bilety równocześnie do kolekcji Users i Programmes używamy transakcji, wykorzystujemy to samo id biletu,
dzięki użyciu transakcji jeśli jedno dodanie się nie powiedzi, po porstu abortujemy całość.

```javascript
seanseFound.seats[row].seats[col].availability = false;
await programme.save();
//add ticket in both places using transactions
const session = await mongoose.startSession();
session.startTransaction();
try {
  ticket = {
    id: new mongoose.Types.ObjectId(),
    userid: user._id,
    programmeid: programme._id,
    seanseid: seanseid,
    price: req.body.price,
    type: req.body.type,
    movieinfo: {
      moviename: moviename,
      moviedate: moviedate,
      "3d": is3d,
      seatinfo: {
        room: roomnumber,
        row: row,
        seat: seatnumber,
      },
    },
  };
  seanseFound.tickets.push(ticket);
  user.tickets.push(ticket);
  await user.save();
  await programme.save();
  await session.commitTransaction();
  session.endSession();
} catch (error) {
  await session.abortTransaction();
  session.endSession();
  seanseFound.seats[row].seats[col].availability = true;
  await programme.save();
}
```
